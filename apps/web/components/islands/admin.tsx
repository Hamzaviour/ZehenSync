"use client";
import { useState } from "react";
import { Table, Td, Th } from "@/components/clinician/table";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/form";
import { Pill, SeverityTag } from "@/components/ui/tags";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { pendingClinicians } from "@/lib/demo/people";

export function VerificationQueue() {
  const toast = useToast();
  const [list, setList] = useState(pendingClinicians);
  const [sel, setSel] = useState(0);
  const [reason, setReason] = useState("");
  const open = list[Math.min(sel, list.length - 1)];

  function decide(kind: "Approved" | "Rejected") {
    if (!open) return;
    if (kind === "Rejected" && !reason.trim()) { toast("Add a reason before rejecting."); return; }
    setList((l) => l.filter((c) => c.licence !== open.licence));
    setSel(0); setReason("");
    toast(`${kind}: ${open.name}`);
  }

  if (!open) return <p className="rounded-lg border border-dashed border-line-strong bg-sunken px-6 py-8 text-base">No applications waiting.</p>;
  return (
    <div className="grid grid-cols-[360px_1fr] gap-6">
      <ul className="flex flex-col divide-y divide-line self-start rounded-lg border border-line">
        {list.map((c, i) => (
          <li key={c.licence}>
            <button type="button" onClick={() => setSel(i)} aria-current={open.licence === c.licence}
              className={cn("flex w-full flex-col gap-0.5 px-4 py-3.5 text-left hover:bg-sunken", open.licence === c.licence && "bg-accent-subtle")}>
              <span className="font-medium">{c.name}</span>
              <span className="text-[13px] text-ink-2">{c.institution}</span>
              <span className="font-mono text-[12px] text-muted">Sent {c.sent}</span>
            </button>
          </li>
        ))}
      </ul>
      <section className="flex flex-col gap-6 rounded-lg border border-line p-6">
        <header className="flex items-start justify-between"><div><h2 className="font-serif text-2xl">{open.name}</h2><p className="text-ink-2">{open.institution}</p></div><Pill tone="watch">Waiting</Pill></header>
        <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-[14px]">
          <dt className="text-muted">Licence number</dt><dd className="font-mono">{open.licence}</dd>
          <dt className="text-muted">Proof</dt><dd>{open.proof} · <span className="font-mono">{open.size}</span></dd>
        </dl>
        <div className="grid h-72 place-items-center rounded-md border border-dashed border-line-strong bg-sunken text-sm text-muted">Proof viewer: {open.proof}</div>
        <Textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} aria-label="Reason" placeholder="Reason (required when rejecting)" />
        <div className="flex gap-3"><Button onClick={() => decide("Approved")}>Approve</Button><Button variant="secondary" onClick={() => decide("Rejected")}>Reject</Button></div>
      </section>
    </div>
  );
}

export function SafetyTable() {
  const toast = useToast();
  const [reviewed, setReviewed] = useState(false);
  return (
    <Table>
      <thead><tr><Th>Severity</Th><Th>When</Th><Th>Person</Th><Th>Response</Th><Th>Reviewed</Th><Th /></tr></thead>
      <tbody>
        <tr><Td><SeverityTag level="crisis" /></Td><Td className="font-mono">29 Nov 23:41</Td><Td className="font-mono">ZS-4C8V-3N</Td><Td>Hard stop, crisis screen shown</Td>
          <Td className={reviewed ? "" : "text-muted"}>{reviewed ? "Today by Admin" : "Not yet"}</Td>
          <Td className="text-right">{!reviewed && <Button variant="quiet" onClick={() => { setReviewed(true); toast("Marked reviewed"); }}>Mark reviewed</Button>}</Td></tr>
        <tr><Td><SeverityTag level="watch" /></Td><Td className="font-mono">27 Nov 20:05</Td><Td className="font-mono">ZS-1B7Q-6W</Td><Td>Safety pathway, screener low</Td><Td>28 Nov by Admin</Td><Td /></tr>
      </tbody>
    </Table>
  );
}

const auditRows = [
  ["30 Nov 09:12:04", "clinician", "read.patient_summary", "ZS-7F3K-2Q", "a41f…09c2"],
  ["30 Nov 09:11:47", "clinician", "read.flag_trace", "ZS-7F3K-2Q", "77d0…e1a8"],
  ["29 Nov 16:30:10", "admin", "clinician.approve", "user-0143", "c9b2…4f10"],
  ["29 Nov 16:28:52", "admin", "login.mfa_ok", "user-0009", "02ee…b7d5"],
];

export function AuditPanel() {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [verified, setVerified] = useState("30 Nov 08:00");
  const rows = auditRows.filter((r) => r.join(" ").toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex max-w-[720px] flex-1 gap-3">
          <Input aria-label="Search" placeholder="Search by actor, action or target" value={q} onChange={(e) => setQ(e.target.value)} />
          <Button variant="secondary" onClick={() => { setVerified("just now"); toast(`Chain verified: ${auditRows.length} rows, no gaps`); }}>Verify chain</Button>
        </div>
        <Pill tone="steady">Chain verified {verified}</Pill>
      </div>
      <Table>
        <thead><tr><Th>Time</Th><Th>Actor</Th><Th>Action</Th><Th>Target</Th><Th>Hash</Th></tr></thead>
        <tbody>
          {rows.map((r) => <tr key={r[0]}><Td className="font-mono">{r[0]}</Td><Td>{r[1]}</Td><Td className="font-mono">{r[2]}</Td><Td className="font-mono">{r[3]}</Td><Td className="font-mono text-muted">{r[4]}</Td></tr>)}
          {rows.length === 0 && <tr><Td className="text-ink-2">No rows match.</Td></tr>}
        </tbody>
      </Table>
    </>
  );
}
