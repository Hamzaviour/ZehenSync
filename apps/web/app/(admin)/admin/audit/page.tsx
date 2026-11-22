import { AuditPanel } from "@/components/islands/admin";
import { PageHeader } from "@/components/shell/app-shell";

export const metadata = { title: "Audit" };

export default function Audit() {
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <PageHeader title="Audit log" sub="Append-only. Each row carries the hash of the one before it." />
      <AuditPanel />
      <p className="text-[13px] text-muted">Rows hold IDs only, never message text or answers.</p>
    </div>
  );
}
