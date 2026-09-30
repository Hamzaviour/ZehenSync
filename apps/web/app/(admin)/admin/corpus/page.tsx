import { Table, Td, Th } from "@/components/clinician/table";
import { PageHeader } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/tags";

export const metadata = { title: "Corpus" };

const rows = [
  ["DSM-5-TR", "1,050", "4,812", "Indexed", "steady"],
  ["Interview guide for clinical students", "312", "1,204", "Indexed", "steady"],
  ["CBT: an introduction", "268", "1,017", "Embedding 62%", "watch"],
  ["WHO mhGAP guidance", "140", "0", "Queued", "neutral"],
] as const;

export default function Corpus() {
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <PageHeader title="Corpus" sub="Sources the tutor can cite." actions={<Button>Add source</Button>} />
      <Table>
        <thead><tr><Th>Source</Th><Th className="text-right">Pages</Th><Th className="text-right">Chunks</Th><Th>Status</Th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]}><Td>{r[0]}</Td><Td className="text-right font-mono">{r[1]}</Td><Td className="text-right font-mono">{r[2]}</Td><Td><Pill tone={r[4] === "neutral" ? "neutral" : r[4]}>{r[3]}</Pill></Td></tr>)}</tbody>
      </Table>
    </div>
  );
}
