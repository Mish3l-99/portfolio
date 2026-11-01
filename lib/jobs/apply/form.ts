import type { Locator } from "playwright-core";

import { pace } from "../browser";
import type { Job } from "../types";
import { answerFor, chooseOption, type FieldKind } from "./answers";

/**
 * Generic application-form filler. It reads every visible field in a step,
 * resolves its question text, answers from the profile, and reports the
 * required questions it couldn't answer so the job can be handed to you.
 */

type Field = {
  fid: string;
  kind: FieldKind | "file";
  label: string;
  required: boolean;
  filled: boolean;
  combobox: boolean;
  /** For radio groups: one fid per option. For selects: option texts. */
  options: { fid?: string; text: string }[];
};

/** Runs in the page: tags fields with data-jobs-fid and describes them. */
function collect(root: Element): Field[] {
  let seq = Number(root.getAttribute("data-jobs-seq") ?? 0);
  const tag = (el: Element) => {
    if (!el.getAttribute("data-jobs-fid"))
      el.setAttribute("data-jobs-fid", `f${++seq}`);
    return el.getAttribute("data-jobs-fid")!;
  };
  const text = (el: Element | null | undefined) =>
    (el as HTMLElement | null)?.innerText?.replace(/\s+/g, " ").trim() ?? "";
  const visible = (el: Element) => {
    const r = (el as HTMLElement).getBoundingClientRect();
    const style = getComputedStyle(el);
    // Custom-styled radios/checkboxes are often 0×0 but still clickable via their label.
    const tiny =
      (el as HTMLInputElement).type === "radio" ||
      (el as HTMLInputElement).type === "checkbox" ||
      (el as HTMLInputElement).type === "file";
    return (
      style.visibility !== "hidden" &&
      style.display !== "none" &&
      (tiny || (r.width > 0 && r.height > 0))
    );
  };
  const labelOf = (el: Element): string => {
    const by = el.getAttribute("aria-labelledby");
    if (by) {
      const t = by
        .split(/\s+/)
        .map((id) => text(document.getElementById(id)))
        .join(" ")
        .trim();
      if (t) return t;
    }
    if (el.id) {
      const l = root.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (text(l)) return text(l);
    }
    if (text(el.closest("label"))) return text(el.closest("label"));
    const aria = el.getAttribute("aria-label");
    if (aria) return aria;
    let p = el.parentElement;
    for (let i = 0; i < 4 && p && p !== root; i++, p = p.parentElement) {
      const l = p.querySelector(
        "label, legend, [class*='label' i], [class*='question' i]",
      );
      if (l && !l.contains(el) && text(l)) return text(l);
    }
    return el.getAttribute("placeholder") ?? el.getAttribute("name") ?? "";
  };
  const isRequired = (el: Element, label: string) =>
    (el as HTMLInputElement).required ||
    el.getAttribute("aria-required") === "true" ||
    /\*\s*$|\(required\)|required/i.test(label);

  const fields: Field[] = [];
  const radiosSeen = new Set<string>();

  for (const el of Array.from(
    root.querySelectorAll("input, textarea, select"),
  )) {
    if (!visible(el) || (el as HTMLInputElement).disabled) continue;
    const input = el as HTMLInputElement;
    const type = (input.type || "text").toLowerCase();
    if (
      ["hidden", "submit", "button", "search", "image", "reset"].includes(type)
    )
      continue;

    if (type === "radio") {
      const name = input.name || input.closest("fieldset")?.id || tag(el);
      if (radiosSeen.has(name)) continue;
      radiosSeen.add(name);
      const group = Array.from(
        root.querySelectorAll(
          `input[type=radio][name="${CSS.escape(input.name)}"]`,
        ),
      );
      const set = el.closest("fieldset, [role=radiogroup]");
      const legend =
        text(set?.querySelector("legend, [class*='title' i], span")) ||
        text(set?.previousElementSibling);
      const label = legend || labelOf(el);
      fields.push({
        fid: tag(el),
        kind: "radio",
        label,
        required:
          isRequired(el, label) || Boolean(set?.getAttribute("aria-required")),
        filled: group.some((r) => (r as HTMLInputElement).checked),
        combobox: false,
        options: group.map((r) => ({
          fid: tag(r),
          text: labelOf(r) || (r as HTMLInputElement).value,
        })),
      });
      continue;
    }

    const label = labelOf(el);
    if (el.tagName === "SELECT") {
      const select = el as HTMLSelectElement;
      const current = select.options[select.selectedIndex]?.text ?? "";
      fields.push({
        fid: tag(el),
        kind: "select",
        label,
        required: isRequired(el, label),
        filled:
          select.selectedIndex > 0 ||
          (select.value !== "" && !/select/i.test(current)),
        combobox: false,
        options: Array.from(select.options).map((o) => ({ text: o.text })),
      });
      continue;
    }

    fields.push({
      fid: tag(el),
      kind:
        type === "file"
          ? "file"
          : type === "checkbox"
            ? "checkbox"
            : el.tagName === "TEXTAREA"
              ? "textarea"
              : type === "number"
                ? "number"
                : "text",
      label,
      required: isRequired(el, label),
      filled:
        type === "checkbox"
          ? input.checked
          : type === "file"
            ? Boolean(input.files?.length)
            : input.value.trim() !== "",
      combobox:
        el.getAttribute("role") === "combobox" ||
        el.getAttribute("aria-autocomplete") === "list",
      options: [],
    });
  }
  root.setAttribute("data-jobs-seq", String(seq));
  return fields;
}

export type StepContext = { job: Job; resumeFile: string };

const clip = (s: string) => (s.length > 120 ? `${s.slice(0, 117)}…` : s);

/** Fills one step of an application. Returns required questions left unanswered. */
export async function fillStep(
  scope: Locator,
  { job, resumeFile }: StepContext,
) {
  const fields = await scope.evaluate(collect);
  const unanswered: string[] = [];
  const at = (fid: string) => scope.locator(`[data-jobs-fid="${fid}"]`);

  for (const f of fields) {
    try {
      if (f.kind === "file") {
        if (f.filled) continue;
        // Resume uploads get the tailored PDF; other uploads (cover letter, transcripts) are left to you if required.
        if (/cover|transcript|certificate|photo|portfolio/i.test(f.label)) {
          if (f.required && !f.filled)
            unanswered.push(clip(f.label || "File upload"));
          continue;
        }
        await at(f.fid).setInputFiles(resumeFile);
        await pace(1500, 2500);
        continue;
      }
      if (f.filled) continue;

      const answer = answerFor(f.label, f.kind, job);
      if (answer === null) {
        if (f.required) unanswered.push(clip(f.label || "Unlabelled question"));
        continue;
      }

      if (f.kind === "radio") {
        const i = chooseOption(
          answer,
          f.options.map((o) => o.text),
        );
        if (i < 0) {
          if (f.required) unanswered.push(clip(f.label));
          continue;
        }
        await at(f.options[i].fid!).check({ force: true });
      } else if (f.kind === "select") {
        const i = chooseOption(
          answer,
          f.options.map((o) => o.text),
        );
        if (i < 0) {
          if (f.required) unanswered.push(clip(f.label));
          continue;
        }
        await at(f.fid).selectOption({ index: i });
      } else if (f.kind === "checkbox") {
        if (answer === "Yes") await at(f.fid).check({ force: true });
        else if (f.required) unanswered.push(clip(f.label));
      } else {
        const value =
          f.kind === "number" ? answer.replace(/[^\d.]/g, "") : answer;
        if (f.kind === "number" && !value) {
          if (f.required) unanswered.push(clip(f.label));
          continue;
        }
        await at(f.fid).fill(value);
        if (f.combobox) {
          // Typeahead fields (e.g. LinkedIn's city) need a suggestion picked.
          const option = scope
            .page()
            .locator("[role=listbox] [role=option]")
            .first();
          await option.waitFor({ timeout: 4000 }).then(
            () => option.click(),
            () => undefined,
          );
        }
      }
      await pace(250, 700);
    } catch {
      if (f.required) unanswered.push(clip(f.label || "Question"));
    }
  }
  return unanswered;
}
