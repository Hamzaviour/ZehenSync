import { Table, Td, Th } from "@/components/clinician/table";
import { PageHeader } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Pill } from "@/components/ui/tags";

export const metadata = { title: "Audit" };

const rows = [
  ["30 Nov 09:12:04", "clinician", "read.patient_summary", "ZS-7F3K-2Q", "a41f…09c2"],
  ["30 Nov 09:11:47", "clinician", "read.flag_trace", "ZS-7F3K-2Q", "77d0…e1a8"],
  ["29 Nov 16:30:10", "admin", "clinician.approve", "user-0143", "c9b2…4f10"],
  ["29 Nov 16:28:52", "admin", "login.mfa_ok", "user-0009", "02ee…b7d5"],
];

export default function Audit() {
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <PageHeader title="Audit log" sub="Append-only. Each row carries the hash of the one before it." actions={<Pill tone="steady">Chain verified 30 Nov 08:00</Pill>} />
      <div className="flex max-w-[720px] gap-3"><Input aria-label="Search" placeholder="Search by actor, action or target" /><Button variant="secondary">Verify chain</Button></div>
      <Table>
        <thead><tr><Th>Time</Th><Th>Actor</Th><Th>Action</Th><Th>Target</Th><Th>Hash</Th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]}><Td className="font-mono">{r[0]}</Td><Td>{r[1]}</Td><Td className="font-mono">{r[2]}</Td><Td className="font-mono">{r[3]}</Td><Td className="font-mono text-muted">{r[4]}</Td></tr>)}</tbody>
      </Table>
      <p className="text-[13px] text-muted">Rows hold IDs only, never message text or answers.</p>
    </div>
  );
}
