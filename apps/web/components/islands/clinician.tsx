"use client";
import Link from "next/link";
import { createContext, useContext, useMemo, useState } from "react";
import { Segmented } from "@/components/ui/segmented";
import { Table, Td, Th } from "@/components/clinician/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form";
import { DeltaChip, Pill, SeverityTag } from "@/components/ui/tags";
import { useToast } from "@/components/ui/toast";
import { queue } from "@/lib/demo/people";

export function QueueTable() {
  const [show, setShow] = useState("All");
  const [sev, setSev] = useState("Any");
  const rows = useMemo(() => queue.filter((p) =>
    (show === "All" || (show === "Open flags" ? p.flags > 0 : p.last.startsWith("Today") || p.last.startsWith("Yesterday"))) &&
    (sev === "Any" || p.level === sev.toLowerCase())), [show, sev]);
  return (
    <>
      <div className="flex gap-4">
        <Segmented label="Show" options={["All", "Open flags", "Recent"]} active="All" onChange={setShow} />
        <Segmented label="Severity" options={["Any", "Crisis", "Urgent", "Watch"]} active="Any" onChange={setSev} />
      </div>
      <Table>
        <thead><tr>
          <Th className="w-32">Severity</Th><Th>Person</Th><Th>Latest</Th><Th>Change</Th>
          <Th className="text-right">Open flags</Th><Th>Last activity</Th><Th>Linked since</Th>
        </tr></thead>
        <tbody>
          {rows.map((p) => (
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
          {rows.length === 0 && <tr><Td className="text-ink-2" >No one matches these filters.</Td></tr>}
        </tbody>
      </Table>
    </>
  );
}

type Status = "Open" | "Acknowledged" | "Resolved";
const FlagCtx = createContext<{ status: Status; set: (s: Status) => void }>({ status: "Open", set: () => {} });

export function FlagProvider({ children }: { children: React.ReactNode }) {
  const [status, set] = useState<Status>("Open");
  return <FlagCtx.Provider value={{ status, set }}>{children}</FlagCtx.Provider>;
}

export function FlagStatus() {
  const { status } = useContext(FlagCtx);
  return <Pill tone={status === "Resolved" ? "steady" : status === "Acknowledged" ? "accent" : "watch"}>{status}</Pill>;
}

export function FlagActions() {
  const { status, set } = useContext(FlagCtx);
  const toast = useToast();
  const [note, setNote] = useState(false);
  const [text, setText] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-4">
      <footer className="flex items-center justify-between border-t border-line pt-5">
        <div className="flex gap-3">
          <Button disabled={status !== "Open"} onClick={() => { set("Acknowledged"); toast("Flag acknowledged"); }}>Acknowledge</Button>
          <Button variant="secondary" disabled={status === "Resolved"} onClick={() => { set("Resolved"); toast("Flag resolved"); }}>Resolve</Button>
          <Button variant="secondary" onClick={() => setNote((v) => !v)}>Add note</Button>
        </div>
        <Button variant="secondary" onClick={() => toast("Evidence export queued (demo: no file is made)")}>Export evidence</Button>
      </footer>
      {note && (
        <div className="flex max-w-[640px] flex-col gap-3">
          <Textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} aria-label="Note" placeholder="Only you can read this note." />
          <div><Button disabled={!text.trim()} onClick={() => { setNotes((n) => [text.trim(), ...n]); setText(""); setNote(false); toast("Note saved"); }}>Save note</Button></div>
        </div>
      )}
      {notes.map((n, i) => <p key={i} className="max-w-[640px] rounded-md bg-sunken px-4 py-3 text-[14px]"><span className="mr-2 font-mono text-[12px] text-muted">Your note</span>{n}</p>)}
    </div>
  );
}

export function NoteBox() {
  const toast = useToast();
  const [text, setText] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  return (
    <div className="flex max-w-[720px] flex-col gap-3">
      <Textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} aria-label="Note" placeholder="Add a note. Only you can read it." />
      <div><Button disabled={!text.trim()} onClick={() => { setNotes((n) => [text.trim(), ...n]); setText(""); toast("Note saved"); }}>Save note</Button></div>
      {notes.map((n, i) => <p key={i} className="rounded-md bg-sunken px-4 py-3 text-[14px]">{n}</p>)}
    </div>
  );
}
