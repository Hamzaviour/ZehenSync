import { Table, Td, Th } from "@/components/clinician/table";
import { PageHeader } from "@/components/shell/app-shell";
import { DemoTag } from "@/components/ui/tags";

export const metadata = { title: "Sources" };

const sources = [
  ["DSM-5-TR", "Reference", "Tier 1", "1,050"],
  ["Interview guide for clinical students", "Textbook", "Tier 1", "312"],
  ["Cognitive behavioural therapy: an introduction", "Textbook", "Tier 1", "268"],
  ["WHO mhGAP guidance", "Guideline", "Tier 1", "140"],
];

export default function Sources() {
  return (
    <div className="flex max-w-[960px] flex-col gap-6 px-6 py-8">
      <PageHeader title="Sources" sub="The tutor answers from these first. Recent papers are searched only when they do not cover a question." actions={<DemoTag />} />
      <Table>
        <thead><tr><Th>Title</Th><Th>Type</Th><Th>Tier</Th><Th className="text-right">Pages</Th></tr></thead>
        <tbody>{sources.map((s) => <tr key={s[0]}><Td>{s[0]}</Td><Td className="text-ink-2">{s[1]}</Td><Td>{s[2]}</Td><Td className="text-right font-mono">{s[3]}</Td></tr>)}</tbody>
      </Table>
    </div>
  );
}
