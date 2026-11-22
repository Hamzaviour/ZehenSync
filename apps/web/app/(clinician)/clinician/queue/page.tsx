import { QueueTable } from "@/components/islands/clinician";
import { PageHeader } from "@/components/shell/app-shell";
import { PrototypeStates } from "@/components/prototype-states";

export const metadata = { title: "Queue" };

export default function Queue() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col">
      <div className="flex flex-col gap-6 px-6 py-8">
        <PageHeader title="Queue" sub="Sorted by crisis, urgent, rapid change, watch, then oldest unreviewed." />
        <QueueTable />
      </div>
      <PrototypeStates current="/clinician/queue" items={[{ href: "/clinician/queue", label: "With people" }, { href: "/clinician/queue/empty", label: "Empty" }]} />
    </div>
  );
}
