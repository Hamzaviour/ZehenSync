import Link from "next/link";
import { TraceRow } from "@/components/clinician/trace-row";
import { FlagActions, FlagProvider, FlagStatus } from "@/components/islands/clinician";
import { SeverityTag } from "@/components/ui/tags";

export const metadata = { title: "Flag trace" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ fid: "F-1042" }]; }

// The product's proof: every claim links to the stored value it came from (Design-System §4.5).
export default function FlagTrace() {
  return (
    <FlagProvider>
    <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-6 px-6 py-8">
      <header className="flex items-start justify-between gap-6 border-b border-line pb-5">
        <div className="flex flex-col gap-2">
          <div><SeverityTag level="urgent" /></div>
          <h1 className="font-serif text-[32px] leading-tight">Rapid increase in depression score</h1>
          <p className="font-mono text-[13px] text-muted">Rule PHQ9.delta.gte5 v1.0 · raised 20 Nov 2026 14:06 · 6 sources</p>
        </div>
        <div className="flex flex-col items-end gap-1 text-[13px]">
          <Link href="/clinician/patients/ZS-7F3K-2Q" className="font-mono text-base text-accent underline underline-offset-4">ZS-7F3K-2Q</Link>
          <FlagStatus />
        </div>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted">Why this flag exists</h2>
        <p className="font-serif text-2xl leading-snug">PHQ-9 rose from a baseline of 4.3 (3 sessions) to 12 within 9 days.</p>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted">Evidence</h2>
          <span className="font-mono text-[12px] text-muted">● trigger · ○ baseline</span>
        </div>
        <div className="overflow-hidden rounded-lg border border-line">
          <TraceRow trigger when="20 Nov 14:05" source="PHQ-9 session" summary="Total 12 (moderate)" value="12">
            <p className="mb-3 font-medium">Item 2</p>
            <dl className="grid grid-cols-[130px_1fr] gap-y-2">
              <dt className="text-muted">Canonical wording</dt><dd className="font-serif text-lg">&ldquo;Feeling down, depressed, or hopeless&rdquo;</dd>
              <dt className="text-muted">Shown as</dt><dd className="font-serif text-lg">&ldquo;How often have you felt low or hopeless?&rdquo;</dd>
              <dt className="text-muted">Answer</dt><dd className="font-mono">More than half the days (2)</dd>
              <dt className="text-muted">Equivalence</dt><dd className="font-mono">0.93 · prompt rephrase.v1.2</dd>
            </dl>
          </TraceRow>
          <TraceRow when="11 Nov 10:12" source="PHQ-9 session" summary="Total 4" value="4"><p>Below the minimal band. No item 9 signal.</p></TraceRow>
          <TraceRow when="03 Nov 18:40" source="PHQ-9 session" summary="Total 5" value="5"><p>Mild band lower edge.</p></TraceRow>
          <TraceRow when="27 Oct 09:30" source="PHQ-9 session" summary="Total 4" value="4"><p>Earliest session used for the baseline.</p></TraceRow>
          <TraceRow when="—" source="Background" summary="Financial strain, night-shift work" value="SDOH"><p>Intake answers from 30 Sep. Shared with your scope: background.</p></TraceRow>
          <TraceRow when="19 Nov 22:14" source="Chat" summary="&ldquo;i haven't slept properly in days&rdquo;" value="msg 41"><p>Stored message text, shown because this person shared chat transcripts.</p></TraceRow>
        </div>
      </section>

      <FlagActions />
      <p className="text-[13px] text-muted">This flag suggests a change worth looking at. It is not a diagnosis. Behavioural markers never raise a flag on their own.</p>
    </div>
    </FlagProvider>
  );
}
