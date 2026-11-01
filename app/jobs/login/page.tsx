import Image from "next/image";

import LoginForm from "@/components/jobs/LoginForm";

export default async function LoginPage({
  searchParams,
}: PageProps<"/jobs/login">) {
  const { next } = await searchParams;
  return (
    <section className="grid min-h-dvh place-items-center px-5">
      <div className="card w-full max-w-sm p-8">
        <Image
          src="/assets/logo/MN.png"
          alt=""
          width={48}
          height={26}
          className="h-6 w-auto"
        />
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          Job <span className="font-serif font-normal italic">hunt</span>
        </h1>
        <p className="mt-1 text-sm text-muted">
          Private area. Sign in to continue.
        </p>
        <LoginForm next={typeof next === "string" ? next : "/jobs"} />
      </div>
    </section>
  );
}
