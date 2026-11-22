import Link from "next/link";
import { ResultBand } from "@/components/patient/parts";
import { runnerStates } from "@/components/patient/runner-states";
import { PrototypeStates } from "@/components/prototype-states";
import { ButtonLink } from "@/components/ui/button";
import { result } from "@/lib/demo/instruments";

export const metadata = { title: "Your result" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ session: "demo" }]; }

export default function Result() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col gap-10 px-6 py-16">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">Low mood check-in · 20 Nov 2026</p>
          <h1 className="font-serif text-[32px] leading-tight font-normal">{result.headline}</h1>
          <p className="text-lg text-ink-2">{result.body}</p>
        </div>
        <ResultBand score={result.score} max={result.max} active={result.bandIndex} />
        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-2xl">What you can do next</h2>
          <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">
            <li className="flex items-center justify-between px-5 py-4"><span>Talk it through with the counselor</span><Link href="/talk/demo" className="text-accent underline underline-offset-4">Talk</Link></li>
            <li className="flex items-center justify-between px-5 py-4"><span>Share this result with your psychologist</span><Link href="/sharing" className="text-accent underline underline-offset-4">Sharing</Link></li>
            <li className="flex items-center justify-between px-5 py-4"><span>Check in again in 2 weeks</span><span className="text-sm text-muted">4 Dec 2026</span></li>
          </ul>
        </section>
        <p className="text-base text-ink-2">Dr. A. Khan can see this result.</p>
        <div className="flex items-center gap-3">
          <ButtonLink href="/home" size="lg">Back to home</ButtonLink>
          <ButtonLink href="/history" variant="secondary" size="lg">My history</ButtonLink>
        </div>
        <p className="border-t border-line pt-4 text-[13px] text-muted">This describes how you have been feeling. It is not a diagnosis.</p>
      </main>
      <PrototypeStates current="/check-in/demo/result" items={runnerStates} />
    </>
  );
}
