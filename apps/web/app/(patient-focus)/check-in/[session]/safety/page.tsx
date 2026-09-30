import Link from "next/link";
import { AnswerGroup } from "@/components/patient/answer-group";
import { ResourcesStrip } from "@/components/patient/parts";
import { runnerStates } from "@/components/patient/runner-states";
import { PrototypeStates } from "@/components/prototype-states";
import { ButtonLink } from "@/components/ui/button";
import { cssrsQ1 } from "@/lib/demo/instruments";

export const metadata = { title: "A few questions about your safety" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ session: "demo" }]; }

export default function SafetyPathway() {
  return (
    <>
      <ResourcesStrip />
      <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col gap-8 px-6 py-16">
        <div className="flex flex-col gap-3">
          <p className="text-base text-ink-2">Thank you for telling me that. I&apos;d like to ask a few more questions about your safety.</p>
          <p className="text-sm text-muted">Question 1 of 2 · These words are fixed and are never reworded.</p>
          <h1 className="font-serif text-[28px] leading-snug font-normal">{cssrsQ1}</h1>
        </div>
        <AnswerGroup options={["Yes", "No"]} initial={1} />
        <footer className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <Link href="/check-in/demo" className="text-accent underline underline-offset-4">Back</Link>
          <ButtonLink href="/check-in/demo/result" size="lg">Next</ButtonLink>
        </footer>
      </main>
      <PrototypeStates current="/check-in/demo/safety" items={runnerStates} />
    </>
  );
}
