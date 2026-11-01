"use client";

import { useActionState } from "react";
import { FiArrowRight, FiLoader } from "react-icons/fi";

import { login, type LoginState } from "@/app/jobs/actions";

const field =
  "w-full rounded-xl border border-line bg-white/3 px-4 py-2.5 text-sm outline-none transition placeholder:text-muted/60 focus:border-white/25 focus:bg-white/5";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <form action={action} className="mt-8 space-y-3">
      <input type="hidden" name="next" value={next} />
      <input
        name="username"
        defaultValue={state.username}
        autoComplete="username"
        placeholder="Username"
        required
        className={field}
      />
      <input
        name="password"
        type="password"
        autoFocus={Boolean(state.error)}
        autoComplete="current-password"
        placeholder="Password"
        required
        className={field}
      />
      {state.error && (
        <p role="alert" className="text-sm text-brand-soft">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full disabled:opacity-60"
      >
        {pending ? <FiLoader className="animate-spin" /> : <FiArrowRight />}
        Sign in
      </button>
    </form>
  );
}
