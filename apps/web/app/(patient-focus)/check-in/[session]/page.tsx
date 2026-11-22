import Link from "next/link";
import { AnswerGroup } from "@/components/patient/answer-group";
import { runnerStates } from "@/components/patient/runner-states";
import { PrototypeStates } from "@/components/prototype-states";
import { ButtonLink } from "@/components/ui/button";
import { answerOptions, runnerItem as item } from "@/lib/demo/instruments";

export const metadata = { title: "Check-in" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ session: "demo" }]; }

export default function Runner() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col gap-8 px-6 py-16">
        <div className="flex flex-col gap-3">
          <p className="text-base text-muted">{item.timeframe}</p>
          <h1 className="font-serif text-[28px] leading-snug font-normal">{item.displayed}</h1>
          <details className="text-sm">
            <summary className="w-fit cursor-pointer text-accent underline underline-offset-4">Show original wording</summary>
            <p className="mt-2 rounded-md bg-sunken px-3 py-2 text-ink-2">&ldquo;{item.canonical}&rdquo;</p>
          </details>
        </div>
        <AnswerGroup options={answerOptions.map((o) => o.label)} initial={2} />
        <details className="text-sm">
          <summary className="w-fit cursor-pointer text-accent underline underline-offset-4">Add a note</summary>
          <textarea rows={3} aria-label="Note" className="mt-2 w-full rounded-md border border-line-strong px-3 py-2 text-base" />
        </details>
        <footer className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <Link href="/check-in/demo/setup" className="text-accent underline underline-offset-4">Back</Link>
          <span className="flex items-center gap-6 text-sm text-ink-2">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-line-strong" aria-hidden />Camera off</span>
            <span className="font-mono tnum">{item.n} of {item.of}</span>
          </span>
          <ButtonLink href="/check-in/demo/safety" size="lg">Next</ButtonLink>
        </footer>
      </main>
      <PrototypeStates current="/check-in/demo" items={runnerStates} />
    </>
  );
}
