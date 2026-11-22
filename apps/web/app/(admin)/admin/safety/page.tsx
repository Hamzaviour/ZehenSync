import { SafetyTable } from "@/components/islands/admin";
import { PageHeader } from "@/components/shell/app-shell";

export const metadata = { title: "Safety" };

export default function Safety() {
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <PageHeader title="Crisis events without a linked psychologist" sub="Nobody else was alerted for these. Review each one." />
      <SafetyTable />
      <p className="text-[13px] text-muted">Events list IDs and the response given, never what the person wrote.</p>
    </div>
  );
}
