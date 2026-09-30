import { PageHeader } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form";
import { Pill } from "@/components/ui/tags";

export const metadata = { title: "Settings" };

export default function ClinicianSettings() {
  return (
    <div className="flex max-w-[720px] flex-col gap-8 px-6 py-8">
      <PageHeader title="Settings" />
      <section className="flex flex-col gap-3 rounded-lg border border-line p-6">
        <h2 className="font-serif text-2xl">Invite code</h2>
        <p className="text-ink-2">Give this code to a person you work with. They choose what you can see.</p>
        <div className="flex items-center gap-3"><span className="rounded-md border border-line-strong bg-surface px-4 py-2 font-mono text-lg">KHN-4827</span><Button variant="secondary">Copy code</Button><Button variant="quiet">Make a new code</Button></div>
      </section>
      <section className="flex flex-col gap-3 rounded-lg border border-line p-6">
        <h2 className="font-serif text-2xl">Two-step verification</h2>
        <p className="flex items-center gap-3 text-ink-2"><Pill tone="steady">On</Pill>Authenticator app, added 2 Oct 2026.</p>
      </section>
      <section className="flex flex-col gap-4 rounded-lg border border-line p-6">
        <h2 className="font-serif text-2xl">Notifications</h2>
        <Checkbox id="n1" defaultChecked label="Alert me in the app when a linked person has a crisis flag" description="Always on. This cannot be turned off." />
        <Checkbox id="n2" defaultChecked label="Email me for urgent flags" />
        <Checkbox id="n3" label="Weekly email of new check-ins" />
      </section>
    </div>
  );
}
