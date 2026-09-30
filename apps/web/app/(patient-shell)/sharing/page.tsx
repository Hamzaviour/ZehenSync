import { PageHeader, PatientColumn } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/form";
import { Pill } from "@/components/ui/tags";

export const metadata = { title: "Sharing" };

const scopes: [string, string, string][] = [
  ["name", "Name and contact", "Your name and email."],
  ["scores", "Scores", "The number and wording from each check-in."],
  ["flags", "How answers led to flags", "The answers behind anything your psychologist is asked to look at."],
  ["chat", "Chat transcripts", "What you and the counselor wrote."],
  ["signals", "Camera and voice measurements", "Only if you turned these on during a check-in."],
  ["background", "Background", "Your answers about work, money, sleep and support."],
];

export default function Sharing() {
  return (
    <PatientColumn>
      <PageHeader title="Sharing" sub="A psychologist sees only what you choose, and you can stop at any time." />
      <section className="flex flex-col gap-5 rounded-lg border border-line-strong p-6">
        <h2 className="font-serif text-2xl">Link to a psychologist</h2>
        <Field label="Invite code" htmlFor="code" hint="Your psychologist gives you this code."><Input id="code" defaultValue="KHN-4827" className="w-56 font-mono" /></Field>
        <div className="flex items-center justify-between rounded-md bg-sunken px-4 py-3">
          <span className="flex flex-col"><span className="font-medium">Dr. A. Khan</span><span className="text-sm text-ink-2">Fountain House Clinic, Lahore</span></span>
          <Pill tone="steady">Verified psychologist</Pill>
        </div>
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-1 text-sm font-medium">What they can see</legend>
          {scopes.map(([id, label, desc], i) => <Checkbox key={id} id={id} label={label} description={desc} defaultChecked={i === 1 || i === 2} />)}
        </fieldset>
        <div className="flex gap-3"><Button size="lg">Share with Dr. A. Khan</Button></div>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted">Who can see your data now</h2>
        <div className="flex items-center justify-between rounded-lg border border-line p-5">
          <span className="flex flex-col gap-1"><span className="text-lg">Dr. A. Khan</span><span className="text-sm text-ink-2">Scores, how answers led to flags · linked 3 Nov 2026</span></span>
          <Button variant="secondary">Stop sharing</Button>
        </div>
      </section>
    </PatientColumn>
  );
}
