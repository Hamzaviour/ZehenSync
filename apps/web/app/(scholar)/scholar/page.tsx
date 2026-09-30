import Link from "next/link";
import { PageHeader } from "@/components/shell/app-shell";
import { DemoTag } from "@/components/ui/tags";
import { cases } from "@/lib/demo/scholar";

export const metadata = { title: "Home" };

const topics = ["Diagnostic criteria for depressive disorders", "Risk assessment interviewing", "Screening versus diagnosis"];

export default function ScholarHome() {
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-10 px-6 py-10">
      <PageHeader title="Hi, Bilal." sub="Pick up where you left off." actions={<DemoTag />} />
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted">Continue</h2>
        <Link href="/scholar/ask/demo" className="flex items-center justify-between rounded-lg border border-line-strong p-5 hover:bg-sunken">
          <span className="flex flex-col gap-1"><span className="font-serif text-2xl">Major and persistent depressive disorder</span><span className="text-sm text-muted">Last asked yesterday · 2 references</span></span>
        </Link>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted">Suggested from what you have asked</h2>
        <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">
          {topics.map((t) => <li key={t}><Link href="/scholar/ask/demo" className="block px-5 py-3.5 hover:bg-sunken">{t}</Link></li>)}
        </ul>
      </section>
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between"><h2 className="text-sm font-medium text-muted">Practice interviews</h2><Link href="/scholar/sim" className="text-sm text-accent underline underline-offset-4">All cases</Link></div>
        <ul className="grid grid-cols-2 gap-3">
          {cases.slice(0, 2).map((c) => (
            <li key={c.title}><Link href="/scholar/sim/demo/brief" className="flex h-full flex-col gap-1 rounded-lg border border-line p-5 hover:bg-sunken">
              <span className="text-lg">{c.title}</span><span className="text-sm text-muted">{c.setting} · {c.level} · {c.mins} minutes</span>
            </Link></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
