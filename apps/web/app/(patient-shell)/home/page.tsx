import Link from "next/link";
import { PatientColumn } from "@/components/shell/app-shell";
import { Suggestion } from "@/components/islands/patient";
import { PrototypeStates } from "@/components/prototype-states";

export const metadata = { title: "Home" };

const links = [
  { href: "/talk", label: "Talk" }, { href: "/check-in", label: "Check in" },
  { href: "/history", label: "History" }, { href: "/sharing", label: "Sharing" },
];

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col">
      <PatientColumn>
        <h1 className="font-serif text-[32px]">Hi, Sana.</h1>
        <Suggestion href="/check-in/demo/setup" cta="Start check-in" dismissedNote="No problem. It stays under Check in whenever you want it."
          className="flex flex-col gap-5 rounded-lg border border-line-strong p-8">
          <p className="text-sm text-muted">Suggested next step</p>
          <p className="font-serif text-2xl leading-snug">Sleep came up in your last two chats. A 7-question sleep check-in could help your psychologist.</p>
        </Suggestion>
        <section className="flex items-center justify-between gap-6 rounded-lg border border-line p-6">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted">Last check-in · 20 Nov 2026</p>
            <p className="text-lg">Your answers suggest a noticeable level of low mood.</p>
          </div>
          <Link href="/history" className="shrink-0 text-accent underline underline-offset-4">See history</Link>
        </section>
        <nav aria-label="Quick links" className="flex gap-6 text-base">
          {links.map((l) => <Link key={l.href} href={l.href} className="text-accent underline underline-offset-4">{l.label}</Link>)}
        </nav>
        <p className="border-t border-line pt-4 text-[13px] text-muted">ZehenSync screens and never diagnoses. A licensed psychologist makes every clinical decision.</p>
      </PatientColumn>
      <PrototypeStates current="/home" items={[{ href: "/home", label: "With history" }, { href: "/home/new", label: "First visit" }]} />
    </div>
  );
}
