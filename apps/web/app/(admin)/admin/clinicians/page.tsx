import { PageHeader } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form";
import { Pill } from "@/components/ui/tags";
import { cn } from "@/lib/cn";
import { pendingClinicians } from "@/lib/demo/people";

export const metadata = { title: "Clinicians" };

export default function Clinicians() {
  const open = pendingClinicians[0]!;
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <PageHeader title="Clinician verification" sub="Check each licence against the register before approving." />
      <div className="grid grid-cols-[360px_1fr] gap-6">
        <ul className="flex flex-col divide-y divide-line self-start rounded-lg border border-line">
          {pendingClinicians.map((c, i) => (
            <li key={c.licence} className={cn("flex flex-col gap-0.5 px-4 py-3.5", i === 0 && "bg-accent-subtle")}>
              <span className="font-medium">{c.name}</span>
              <span className="text-[13px] text-ink-2">{c.institution}</span>
              <span className="font-mono text-[12px] text-muted">Sent {c.sent}</span>
            </li>
          ))}
        </ul>
        <section className="flex flex-col gap-6 rounded-lg border border-line p-6">
          <header className="flex items-start justify-between"><div><h2 className="font-serif text-2xl">{open.name}</h2><p className="text-ink-2">{open.institution}</p></div><Pill tone="watch">Waiting</Pill></header>
          <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-[14px]">
            <dt className="text-muted">Licence number</dt><dd className="font-mono">{open.licence}</dd>
            <dt className="text-muted">Proof</dt><dd>{open.proof} · <span className="font-mono">{open.size}</span></dd>
          </dl>
          <div className="grid h-72 place-items-center rounded-md border border-dashed border-line-strong bg-sunken text-sm text-muted">Proof viewer: the uploaded file shows here</div>
          <Textarea rows={2} aria-label="Reason" placeholder="Reason (required when rejecting)" />
          <div className="flex gap-3"><Button>Approve</Button><Button variant="secondary">Reject</Button></div>
        </section>
      </div>
    </div>
  );
}
