import Link from "next/link";
import { PageHeader } from "@/components/shell/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { cases } from "@/lib/demo/scholar";

export const metadata = { title: "Simulator" };

export default function SimLibrary() {
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-6 py-10">
      <PageHeader title="Practice interviews" sub="Interview a simulated client. The diagnosis stays hidden until the debrief." />
      <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">
        {cases.map((c) => (
          <li key={c.title} className="flex items-center justify-between gap-6 px-5 py-4">
            <span className="flex flex-col"><span className="text-lg">{c.title}</span><span className="text-sm text-muted">{c.setting} · {c.level} · {c.mins} minutes</span></span>
            <ButtonLink href="/scholar/sim/demo/brief" variant="secondary">Open</ButtonLink>
          </li>
        ))}
      </ul>
      <p className="text-sm text-ink-2">Prefer to read first? <Link className="text-accent underline underline-offset-4" href="/scholar/ask/demo">Ask the tutor</Link>.</p>
    </div>
  );
}
