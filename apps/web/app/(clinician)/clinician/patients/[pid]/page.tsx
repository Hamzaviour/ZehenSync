import Link from "next/link";
import { Table, Td, Th } from "@/components/clinician/table";
import { Button } from "@/components/ui/button";
import { DeltaChip, Pill, SeverityTag } from "@/components/ui/tags";
import { cn } from "@/lib/cn";
import { queue } from "@/lib/demo/people";

export const metadata = { title: "Patient overview" };

const tabs = ["Summary", "Check-ins", "Flags", "Conversations", "Measurements", "Notes"] as const;

export default async function Overview({ params, searchParams }: {
  params: Promise<{ pid: string }>; searchParams: Promise<{ tab?: string }>;
}) {
  const { pid } = await params;
  const { tab: raw } = await searchParams;
  const tab = tabs.find((t) => t.toLowerCase() === raw) ?? "Summary";
  const p = queue.find((q) => q.pid === pid) ?? queue[0]!;
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <header className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-[32px] leading-tight">{p.name}</h1>
          <p className="flex items-center gap-3 text-[14px] text-ink-2">
            <span className="font-mono">{p.pid}</span><span>Age 25 to 34</span><span>Linked since {p.linked}</span>
            <span className="flex gap-1.5"><Pill>Scores</Pill><Pill>Flags</Pill><Pill>Background</Pill></span>
          </p>
        </div>
        <div className="flex items-center gap-3"><SeverityTag level={p.level} /><span className="text-sm text-ink-2">{p.flags} open flags</span><Button variant="secondary">Export</Button></div>
      </header>
      <nav aria-label="Sections" className="flex gap-1 border-b border-line">
        {tabs.map((t) => (
          <Link key={t} href={`?tab=${t.toLowerCase()}`} aria-current={t === tab ? "page" : undefined}
            className={cn("-mb-px border-b-2 px-4 py-2.5 text-[14px]", t === tab ? "border-accent font-medium text-accent" : "border-transparent text-ink-2 hover:text-ink")}>{t}</Link>
        ))}
      </nav>

      {tab === "Summary" && (
        <div className="grid grid-cols-[2fr_3fr] gap-6">
          <section className="flex flex-col gap-3 rounded-lg border border-line p-5">
            <h2 className="text-sm font-medium text-muted">Latest</h2>
            <p className="text-lg">{p.instrument} <span className="font-mono">{p.score}</span></p>
            <DeltaChip delta={p.delta} />
            <p className="text-[14px] text-ink-2">Last activity {p.last}</p>
          </section>
          <section className="flex flex-col gap-3 rounded-lg border border-line p-5">
            <h2 className="text-sm font-medium text-muted">Open flags</h2>
            <Link href="/clinician/flags/F-1042" className="flex items-center justify-between rounded-md bg-sunken px-4 py-3 hover:bg-accent-subtle">
              <span className="flex items-center gap-3"><SeverityTag level="urgent" />Rapid increase in depression score</span>
              <span className="font-mono text-[13px] text-muted">20 Nov 14:06</span>
            </Link>
          </section>
        </div>
      )}
      {tab === "Check-ins" && (
        <Table>
          <thead><tr><Th>Date</Th><Th>Instrument</Th><Th className="text-right">Score</Th><Th>Band</Th></tr></thead>
          <tbody>
            {[["20 Nov 14:05", "PHQ-9", "12", "Moderate"], ["11 Nov 10:12", "PHQ-9", "4", "Minimal"], ["03 Nov 18:40", "PHQ-9", "5", "Mild"], ["27 Oct 09:30", "PHQ-9", "4", "Minimal"]].map((r) => (
              <tr key={r[0]}><Td className="font-mono">{r[0]}</Td><Td>{r[1]}</Td><Td className="text-right font-mono">{r[2]}</Td><Td>{r[3]}</Td></tr>
            ))}
          </tbody>
        </Table>
      )}
      {tab === "Flags" && (
        <Table>
          <thead><tr><Th>Severity</Th><Th>Flag</Th><Th>Raised</Th><Th>Status</Th></tr></thead>
          <tbody>
            <tr><Td><SeverityTag level="urgent" /></Td><Td><Link className="text-accent underline underline-offset-4" href="/clinician/flags/F-1042">Rapid increase in depression score</Link></Td><Td className="font-mono">20 Nov 14:06</Td><Td>Open</Td></tr>
            <tr><Td><SeverityTag level="watch" /></Td><Td>Sleep disruption in chat</Td><Td className="font-mono">19 Nov 22:14</Td><Td>Open</Td></tr>
          </tbody>
        </Table>
      )}
      {tab === "Conversations" && (
        <div className="max-w-[680px] rounded-lg border border-line p-5 text-[14px]">
          <p className="mb-3 font-mono text-[12px] text-muted">19 Nov 22:14 · shared scope: chat transcripts</p>
          <p className="rounded-md bg-accent-subtle px-3 py-2">i haven&apos;t slept properly in days</p>
          <p className="mt-3 text-ink-2">That sounds exhausting. Days without proper sleep wear a person down. What has been keeping you up?</p>
        </div>
      )}
      {tab === "Measurements" && (
        <div className="max-w-[720px] rounded-lg border border-dashed border-line-strong bg-sunken p-6 text-[14px] text-ink-2">
          No camera or voice measurements. This person did not turn them on. Measurements only ever add context; they never raise a flag on their own.
        </div>
      )}
      {tab === "Notes" && (
        <div className="flex max-w-[720px] flex-col gap-3">
          <textarea rows={4} aria-label="Note" placeholder="Add a note. Only you can read it." className="rounded-md border border-line-strong px-3 py-2 text-base" />
          <div><Button>Save note</Button></div>
        </div>
      )}
    </div>
  );
}
