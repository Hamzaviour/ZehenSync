import Link from "next/link";
import { PageHeader, PatientColumn } from "@/components/shell/app-shell";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Talk" };

const threads = [
  { id: "demo", title: "Sleep and night shifts", when: "Today, 22:14", preview: "Night shifts and money worries can feed each other." },
  { id: "demo", title: "A hard week at work", when: "19 Nov 2026", preview: "It sounds like the deadline has been on your mind." },
  { id: "demo", title: "Getting started", when: "3 Nov 2026", preview: "Thanks for telling me a bit about yourself." },
];

export default function Talk() {
  return (
    <PatientColumn>
      <PageHeader title="Talk" sub="A counselor you can message any time. It is an AI, not a person, and it does not diagnose."
        actions={<ButtonLink href="/talk/demo" size="lg">New chat</ButtonLink>} />
      <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">
        {threads.map((t, i) => (
          <li key={i}>
            <Link href={`/talk/${t.id}`} className="flex flex-col gap-1 px-5 py-4 hover:bg-sunken">
              <span className="flex items-baseline justify-between gap-4"><span className="text-lg">{t.title}</span><span className="shrink-0 text-sm text-muted">{t.when}</span></span>
              <span className="text-sm text-ink-2">{t.preview}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PatientColumn>
  );
}
