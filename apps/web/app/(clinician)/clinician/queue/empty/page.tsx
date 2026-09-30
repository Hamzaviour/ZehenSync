import { PageHeader } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/alert";
import { PrototypeStates } from "@/components/prototype-states";

export const metadata = { title: "Queue" };

export default function QueueEmpty() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col">
      <div className="flex max-w-[720px] flex-col gap-6 px-6 py-8">
        <PageHeader title="Queue" />
        <EmptyState action={<div className="flex items-center gap-3"><span className="rounded-md border border-line-strong bg-surface px-4 py-2 font-mono text-lg">KHN-4827</span><Button variant="secondary">Copy code</Button></div>}>
          No linked patients yet. Share your invite code.
        </EmptyState>
      </div>
      <PrototypeStates current="/clinician/queue/empty" items={[{ href: "/clinician/queue", label: "With people" }, { href: "/clinician/queue/empty", label: "Empty" }]} />
    </div>
  );
}
