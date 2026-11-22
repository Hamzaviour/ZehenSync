import { PageHeader, PatientColumn } from "@/components/shell/app-shell";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Check in" };

const suggested = { code: "ISI", name: "Sleep check-in", items: 7, mins: 3, why: "Sleep came up in your last two chats." };
const all = [
  { name: "Well-being check-in", items: 5, mins: 2, note: "A quick read on how you have been doing." },
  { name: "Low mood check-in", items: 9, mins: 3, note: "Over the last 2 weeks." },
  { name: "Worry and anxiety check-in", items: 7, mins: 3, note: "Over the last 2 weeks." },
  { name: "Stress check-in", items: 10, mins: 4, note: "Over the last month." },
];

export default function CheckInPicker() {
  return (
    <PatientColumn>
      <PageHeader title="Check in" sub="Pick one. You can stop at any point and your answers are kept." />
      <section className="flex flex-col gap-4 rounded-lg border border-line-strong p-6">
        <p className="text-sm text-muted">Suggested for you</p>
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-2xl">{suggested.name}</h2>
            <p className="text-base text-ink-2">{suggested.why} {suggested.items} questions, about {suggested.mins} minutes.</p>
          </div>
          <ButtonLink href="/check-in/demo/setup" size="lg">Start</ButtonLink>
        </div>
      </section>
      <section className="flex items-center justify-between gap-6 rounded-lg border border-line p-6">
        <div className="flex flex-col gap-1"><h2 className="font-serif text-2xl">Spoken check-in</h2><p className="text-base text-ink-2">Answer open questions out loud, in your own words. About 6 minutes. Uses camera and microphone.</p></div>
        <ButtonLink href="/check-in/demo/voice/camera" variant="secondary" size="lg">Set up</ButtonLink>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted">All check-ins</h2>
        <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">
          {all.map((c) => (
            <li key={c.name} className="flex items-center justify-between gap-6 px-5 py-4">
              <div className="flex flex-col"><span className="text-lg">{c.name}</span>
                <span className="text-sm text-muted">{c.items} questions · about {c.mins} minutes · {c.note}</span></div>
              <ButtonLink href="/check-in/demo/setup" variant="secondary">Start</ButtonLink>
            </li>
          ))}
        </ul>
      </section>
    </PatientColumn>
  );
}
