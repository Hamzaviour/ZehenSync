import { CitationMark } from "@/components/citations";
import { Composer } from "@/components/chat";
import { PageHeader } from "@/components/shell/app-shell";
import { Alert } from "@/components/ui/alert";

export const metadata = { title: "Assistant" };

export default function Assistant() {
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-8 px-6 py-8">
      <PageHeader title="Assistant" sub="Answers from the records people shared with you, with a source for every claim. It does not diagnose." />
      <div className="flex flex-col gap-6">
        <p className="ml-auto max-w-[80%] rounded-md bg-accent-subtle px-4 py-3">What changed for ZS-7F3K-2Q since 3 Nov?</p>
        <div className="flex max-w-[80%] flex-col gap-3 text-lg leading-relaxed">
          <p>PHQ-9 rose from 5 on 3 Nov to 12 on 20 Nov<CitationMark n={1} title="PHQ-9 session, 20 Nov 14:05" />, with item 2 answered &ldquo;More than half the days&rdquo;<CitationMark n={2} title="PHQ-9 item 2, 20 Nov" />. On 19 Nov the person wrote that they had not slept properly in days<CitationMark n={3} title="Chat message 41, 19 Nov 22:14" />.</p>
          <p className="text-[14px] text-muted">Sources: [1] PHQ-9 session 20 Nov 14:05 · [2] item 2 stored value · [3] chat message 41</p>
        </div>
        <p className="ml-auto max-w-[80%] rounded-md bg-accent-subtle px-4 py-3">Does she have major depression?</p>
        <Alert>I can&apos;t diagnose. That is your call. Here is what the record shows: one rapid rise on PHQ-9, no item 9 signal, and sleep disruption mentioned in chat.</Alert>
      </div>
      <Composer placeholder="Ask about the records you can see." />
    </div>
  );
}
