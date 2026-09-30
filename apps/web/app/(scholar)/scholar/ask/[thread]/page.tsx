import Link from "next/link";
import { CitationMark, ReferencePanel } from "@/components/citations";
import { Composer } from "@/components/chat";
import { Segmented } from "@/components/clinician/table";
import { Alert } from "@/components/ui/alert";
import { DemoTag } from "@/components/ui/tags";
import { refs } from "@/lib/demo/scholar";

export const metadata = { title: "Tutor" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ thread: "demo" }]; }

export default function Tutor() {
  return (
    <div className="flex gap-10 px-6 py-8 xl:px-10">
      <div className="flex min-w-0 max-w-[720px] flex-1 flex-col gap-8">
        <div className="flex items-center justify-between">
          <Segmented label="Level for this answer" options={["Intro", "Intermediate", "Advanced", "Research"]} active="Intermediate" />
          <DemoTag />
        </div>
        <h1 className="font-serif text-[32px] leading-tight">What separates major depressive disorder from persistent depressive disorder?</h1>
        <article className="flex flex-col gap-4 font-serif text-[18px] leading-[1.6]">
          <p>The main differences are the number of symptoms and how long they last. A major depressive episode needs five or more symptoms in the same two-week period<CitationMark n={1} title="DSM-5-TR, Depressive Disorders, p. 183" />. Persistent depressive disorder asks for depressed mood on more days than not for at least two years in adults<CitationMark n={2} title="DSM-5-TR, Persistent Depressive Disorder, p. 194" />, usually with fewer symptoms at a time.</p>
          <p>The two can occur together. A person with long-standing low mood can also have a major depressive episode on top of it.</p>
        </article>
        <details className="rounded-md border border-line px-4 py-3 text-sm">
          <summary className="cursor-pointer font-medium">How I found this</summary>
          <ul className="mt-3 space-y-1 font-mono text-[13px] text-ink-2">
            <li>Tier 1 · corpus · 14 passages searched · top score 0.91</li>
            <li>Tier 2 · recent papers · skipped, tier 1 was enough</li>
          </ul>
        </details>
        <p className="ml-auto max-w-[80%] rounded-md bg-accent-subtle px-4 py-3">What is the best treatment for it?</p>
        <Alert>
          I can&apos;t find evidence for this in my sources. Try asking about the diagnostic criteria, or browse the <Link className="underline underline-offset-4" href="/scholar/sources">sources</Link>.
        </Alert>
        <Composer placeholder="Ask a question about psychology." />
      </div>
      <ReferencePanel refs={refs} active={1} />
    </div>
  );
}
