import { Table, Td, Th } from "@/components/clinician/table";
import { PageHeader } from "@/components/shell/app-shell";
import { DemoButton } from "@/components/ui/toast";

export const metadata = { title: "Exports" };

const rows = [
  ["20 Nov 2026 15:02", "ZS-7F3K-2Q", "Clinical export", "PDF + JSON", "Scores, flags with sources"],
  ["12 Nov 2026 11:40", "ZS-5T1H-4B", "Patient summary", "PDF", "Scores"],
  ["3 Nov 2026 09:15", "ZS-2M9C-8D", "Clinical export", "PDF + JSON", "Scores, flags with sources"],
];

export default function Exports() {
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <PageHeader title="Exports" sub="Every export is logged. It contains only what the person shared." />
      <Table>
        <thead><tr><Th>When</Th><Th>Person</Th><Th>Type</Th><Th>Format</Th><Th>Contains</Th><Th /></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}><Td className="font-mono">{r[0]}</Td><Td className="font-mono">{r[1]}</Td><Td>{r[2]}</Td><Td>{r[3]}</Td><Td className="text-ink-2">{r[4]}</Td><Td className="text-right"><DemoButton variant="quiet" toast="Demo: no file is made yet">Download</DemoButton></Td></tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
