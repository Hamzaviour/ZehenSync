import Link from "next/link";
import { AuthPage } from "@/components/auth-page";
import { IconArrow } from "@/components/icons-extra";

export const metadata = { title: "Create an account" };

function Choice({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="flex items-center justify-between gap-6 rounded-lg border border-line-strong bg-surface px-6 py-6 hover:border-accent hover:bg-accent-subtle">
      <span className="flex flex-col gap-1">
        <span className="font-serif text-2xl">{title}</span>
        <span className="text-base text-ink-2">{body}</span>
      </span>
      <IconArrow className="shrink-0 text-accent" width={24} height={24} />
    </Link>
  );
}

export default function Fork() {
  return (
    <AuthPage title="What brings you here?" sub="Choose the option closest to you." width={720}>
      <div className="flex flex-col gap-4">
        <Choice href="/signup/support" title="I'm looking for support" body="Short check-ins, a counselor to talk to, and a private record you control." />
        <Choice href="/signup/scholar" title="I'm a psychology student or researcher" body="A tutor that cites its sources, and practice interviews with feedback." />
      </div>
      <p className="text-sm text-ink-2">
        Already have an account? <Link href="/login" className="text-accent underline underline-offset-4">Log in</Link>
        <span className="mx-3 text-line-strong" aria-hidden>|</span>
        <Link href="/signup/clinician" className="text-muted underline underline-offset-4 hover:text-ink">I&apos;m a psychologist</Link>
      </p>
    </AuthPage>
  );
}
