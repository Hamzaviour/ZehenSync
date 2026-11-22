import { PageHeader, PatientColumn } from "@/components/shell/app-shell";
import { DemoButton } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/form";

export const metadata = { title: "Settings" };

const consents = [
  ["terms", "Terms of use", "Required. Accepted 30 Sep 2026, version 1.0.", true],
  ["disclaimer", "ZehenSync screens; it does not diagnose", "Required. Accepted 30 Sep 2026, version 1.0.", true],
  ["ai", "AI processing of your messages", "Required to use the counselor. Accepted 30 Sep 2026.", true],
  ["research", "Use of my anonymised data for research", "Optional. Off.", false],
  ["recording", "Research recordings of camera and voice", "Optional. Off. Turning this on never starts a recording by itself.", false],
] as const;

export default function Settings() {
  return (
    <PatientColumn>
      <PageHeader title="Settings" />
      <section className="flex flex-col gap-5">
        <h2 className="font-serif text-2xl">Your consents</h2>
        <div className="flex flex-col gap-5 rounded-lg border border-line p-6">
          {consents.map(([id, label, desc, on]) => <Checkbox key={id} id={id} label={label} description={desc} defaultChecked={on} />)}
        </div>
        <p className="text-sm text-ink-2">Turning off a required consent pauses your account until you accept it again.</p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl">Camera and microphone</h2>
        <fieldset className="flex flex-col gap-3 rounded-lg border border-line p-6">
          <legend className="sr-only">Default for new check-ins</legend>
          {[["ask", "Ask me each time", true], ["off", "Keep both off", false]].map(([id, label, on]) => (
            <label key={String(id)} className="flex items-center gap-3"><input type="radio" name="media" defaultChecked={Boolean(on)} className="size-4 accent-[var(--accent)]" />{label}</label>
          ))}
        </fieldset>
        <p className="text-sm text-ink-2">Neither starts without a click in that session.</p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl">Your data</h2>
        <div className="flex flex-col gap-4 rounded-lg border border-line p-6">
          <div className="flex items-center justify-between gap-6"><p>Download everything we hold about you.</p><DemoButton variant="secondary" toast="Demo: your data export would be prepared and emailed">Download my data</DemoButton></div>
          <div className="flex items-center justify-between gap-6 border-t border-line pt-4"><p>Delete your account and your data. This cannot be undone.</p><DemoButton variant="secondary" toast="Demo: nothing was deleted. The real flow asks you to confirm first.">Delete account</DemoButton></div>
        </div>
      </section>
    </PatientColumn>
  );
}
