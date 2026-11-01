import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";

import type { Browser, BrowserContext } from "playwright-core";

import { jobsConfig, jobsPaths } from "./config";

/**
 * Two browsers:
 * - a throwaway headless one for rendering resume PDFs;
 * - your persistent Chrome profile (logged into LinkedIn + Indeed) for searching Indeed and applying.
 * Chrome locks a profile dir, so the persistent one is shared through a single promise.
 */

const launchOptions = () => ({
  channel: jobsConfig.browser.channel,
  executablePath: jobsConfig.browser.executablePath,
});

const g = globalThis as typeof globalThis & {
  __jobsPdfBrowser?: Promise<Browser>;
  __jobsProfile?: Promise<BrowserContext>;
};

export async function pdfBrowser() {
  g.__jobsPdfBrowser ??= import("playwright-core").then(({ chromium }) =>
    chromium.launch({ ...launchOptions(), headless: true }),
  );
  const browser = await g.__jobsPdfBrowser;
  if (!browser.isConnected()) {
    g.__jobsPdfBrowser = undefined;
    return pdfBrowser();
  }
  return browser;
}

export function profileContext({
  headless = jobsConfig.browser.headless,
} = {}) {
  g.__jobsProfile ??= (async () => {
    await fs.mkdir(jobsPaths.profile, { recursive: true });
    const { chromium } = await import("playwright-core");
    const ctx = await chromium.launchPersistentContext(jobsPaths.profile, {
      ...launchOptions(),
      headless,
      viewport: null,
    });
    // tsx (the CLI) wraps functions in esbuild's __name helper; page.evaluate needs it defined.
    await ctx.addInitScript("globalThis.__name ??= (fn) => fn;");
    // Closing the window by hand frees the slot for the next launch.
    ctx.on("close", () => (g.__jobsProfile = undefined));
    return ctx;
  })().catch((error) => {
    g.__jobsProfile = undefined;
    throw error;
  });
  return g.__jobsProfile;
}

export async function closeBrowsers() {
  const [pdf, profile] = [g.__jobsPdfBrowser, g.__jobsProfile];
  g.__jobsPdfBrowser = g.__jobsProfile = undefined;
  await Promise.allSettled([
    pdf?.then((b) => b.close()),
    profile?.then((c) => c.close()),
  ]);
}

/** Rate limit between page loads and form steps so the sites aren't hammered. */
export const pace = (min = 800, max = 2000) =>
  new Promise((r) => setTimeout(r, min + Math.random() * (max - min)));

const CHROME_PATHS: Partial<Record<NodeJS.Platform, string[]>> = {
  linux: [
    "/opt/google/chrome/chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
  ],
  darwin: ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"],
  win32: [
    `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  ],
};

function chromeExecutable() {
  const candidates = [
    jobsConfig.browser.executablePath,
    ...(CHROME_PATHS[process.platform] ?? []),
  ];
  const found = candidates.find((p) => p && existsSync(p));
  if (!found)
    throw new Error(
      "Couldn't find Chrome — set JOBS_CHROME_PATH in .env.local",
    );
  return found;
}

/**
 * Opens an ordinary Chrome window on the bot's profile — no automation attached —
 * so you sign in (and pass any "not a robot" check) as yourself.
 * Resolves with the process; its exit means the window was closed.
 */
export async function openPlainChrome(urls: string[]) {
  // Chrome locks a profile to one process at a time.
  await closeBrowsers();
  await fs.mkdir(jobsPaths.profile, { recursive: true });
  return spawn(
    chromeExecutable(),
    [
      `--user-data-dir=${jobsPaths.profile}`,
      // Same cookie-encryption key Playwright uses for the bot. Without these, a
      // normal Chrome encrypts sign-ins with the OS keyring, the bot can't read
      // them, and every run starts signed out.
      "--password-store=basic",
      "--use-mock-keychain",
      "--no-first-run",
      "--no-default-browser-check",
      "--new-window",
      ...urls,
    ],
    { stdio: "ignore" },
  );
}
