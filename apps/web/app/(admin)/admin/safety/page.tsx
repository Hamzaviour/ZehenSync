import { Table, Td, Th } from "@/components/clinician/table";
import { PageHeader } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { SeverityTag } from "@/components/ui/tags";

export const metadata = { title: "Safety" };

export default function Safety() {
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <PageHeader title="Crisis events without a linked psychologist" sub="Nobody else was alerted for these. Review each one." />
      <Table>
        <thead><tr><Th>Severity</Th><Th>When</Th><Th>Person</Th><Th>Response</Th><Th>Reviewed</Th><Th /></tr></thead>
        <tbody>
          <tr><Td><SeverityTag level="crisis" /></Td><Td className="font-mono">29 Nov 23:41</Td><Td className="font-mono">ZS-4C8V-3N</Td><Td>Hard stop, crisis screen shown</Td><Td className="text-muted">Not yet</Td><Td className="text-right"><Button variant="quiet">Mark reviewed</Button></Td></tr>
          <tr><Td><SeverityTag level="watch" /></Td><Td className="font-mono">27 Nov 20:05</Td><Td className="font-mono">ZS-1B7Q-6W</Td><Td>Safety pathway, screener low</Td><Td>28 Nov by Admin</Td><Td /></tr>
        </tbody>
      </Table>
      <p className="text-[13px] text-muted">Events list IDs and the response given, never what the person wrote.</p>
    </div>
  );
}
