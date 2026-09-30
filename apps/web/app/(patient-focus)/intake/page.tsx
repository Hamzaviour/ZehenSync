import Link from "next/link";
import { AnswerOption } from "@/components/patient/parts";
import { ButtonLink } from "@/components/ui/button";
import { PrototypeStates } from "@/components/prototype-states";
import { intakeQuestion as q } from "@/lib/demo/instruments";

export const metadata = { title: "About your life" };

export default function Intake() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col gap-8 px-6 py-16">
        <p className="font-mono text-sm text-muted tnum">{q.n} of {q.of}</p>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">{q.title}</p>
          <h1 className="font-serif text-[28px] leading-snug">{q.question}</h1>
        </div>
        <div className="flex flex-col gap-3">
          {q.options.map((o, i) => <AnswerOption key={o} label={o} hint={i + 1} selected={i === 1} />)}
        </div>
        <div className="flex items-center justify-between">
          <Link href="/intake/why" className="text-accent underline underline-offset-4">Back</Link>
          <ButtonLink href="/intake/done" size="lg">Next</ButtonLink>
        </div>
      </main>
      <PrototypeStates current="/intake" items={[{ href: "/intake/why", label: "Why we ask" }, { href: "/intake", label: "Question" }, { href: "/intake/done", label: "Done" }]} />
    </>
  );
}
