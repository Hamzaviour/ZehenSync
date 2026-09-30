import Link from "next/link";
import { Segmented, Table, Td, Th } from "@/components/clinician/table";
import { PageHeader } from "@/components/shell/app-shell";
import { DeltaChip, SeverityTag } from "@/components/ui/tags";
import { PrototypeStates } from "@/components/prototype-states";
import { queue } from "@/lib/demo/people";

export const metadata = { title: "Queue" };

export default function Queue() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col">
      <div className="flex flex-col gap-6 px-6 py-8">
        <PageHeader title="Queue" sub="Sorted by crisis, urgent, rapid change, watch, then oldest unreviewed." />
        <div className="flex gap-4">
          <Segmented label="Show" options={["All", "Open flags", "Unreviewed"]} active="All" />
          <Segmented label="Severity" options={["Any", "Crisis", "Urgent", "Watch"]} active="Any" />
        </div>
        <Table>
          <thead><tr>
            <Th className="w-32">Severity</Th><Th>Person</Th><Th>Latest</Th><Th>Change</Th>
            <Th className="text-right">Open flags</Th><Th>Last activity</Th><Th>Linked since</Th>
          </tr></thead>
          <tbody>
            {queue.map((p) => (
              <tr key={p.pid} className="hover:bg-sunken">
                <Td><SeverityTag level={p.level} /></Td>
                <Td><Link href={`/clinician/patients/${p.pid}`} className="font-medium text-accent underline-offset-4 hover:underline">{p.name}</Link>
                  <span className="ml-2 font-mono text-[12px] text-muted">{p.pid}</span></Td>
                <Td>{p.instrument} <span className="font-mono">{p.instrument === "C-SSRS" ? "screen" : p.score}</span></Td>
                <Td><DeltaChip delta={p.delta} /></Td>
                <Td className="text-right font-mono">{p.flags}</Td>
                <Td className="text-ink-2">{p.last}</Td>
                <Td className="text-ink-2">{p.linked}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <PrototypeStates current="/clinician/queue" items={[{ href: "/clinician/queue", label: "With people" }, { href: "/clinician/queue/empty", label: "Empty" }]} />
    </div>
  );
}
