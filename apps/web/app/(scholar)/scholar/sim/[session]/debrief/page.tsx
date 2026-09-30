import { PageHeader } from "@/components/shell/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { DemoTag } from "@/components/ui/tags";
import { rubric } from "@/lib/demo/scholar";

export const metadata = { title: "Debrief" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ session: "demo" }]; }

export default function Debrief() {
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-8 px-6 py-10">
      <PageHeader title="Debrief" sub="A teacher who is always tired · 19 minutes" actions={<DemoTag />} />
      <section className="flex flex-col gap-2 rounded-lg border border-line-strong p-6">
        <p className="text-sm text-muted">The case was</p>
        <p className="font-serif text-2xl">A client with a major depressive episode and a night-time sleep problem.</p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted">Rubric</h2>
        <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">
          {rubric.map((r) => (
            <li key={r.area} className="grid grid-cols-[220px_1fr_auto] items-baseline gap-6 px-5 py-4">
              <span className="font-medium">{r.area}</span>
              <span className="text-ink-2">{r.note} <span className="font-mono text-[12px] text-accent">[{r.cite}]</span></span>
              <span className="font-mono tnum">{r.score} of 5</span>
            </li>
          ))}
        </ul>
      </section>
      <div className="flex gap-3"><ButtonLink href="/scholar/sim/demo/brief" size="lg">Try again</ButtonLink><ButtonLink href="/scholar/sim" variant="secondary" size="lg">New case</ButtonLink></div>
    </div>
  );
}
