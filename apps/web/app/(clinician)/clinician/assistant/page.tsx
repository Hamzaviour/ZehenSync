import { ChatThread } from "@/components/chat";
import { PageHeader } from "@/components/shell/app-shell";

export const metadata = { title: "Assistant" };

const initial = [
  { from: "user" as const, text: "What changed for ZS-7F3K-2Q since 3 Nov?" },
  { from: "assistant" as const, text: "PHQ-9 rose from 5 on 3 Nov to 12 on 20 Nov [1], with item 2 answered \"More than half the days\" [2]. On 19 Nov the person wrote that they had not slept properly in days [3]. Sources: [1] PHQ-9 session 20 Nov 14:05 · [2] item 2 stored value · [3] chat message 41." },
  { from: "user" as const, text: "Does she have major depression?" },
  { from: "assistant" as const, text: "I can't diagnose. That is your call. Here is what the record shows: one rapid rise on PHQ-9, no item 9 signal, and sleep disruption mentioned in chat." },
];

const replies = [
  "I can only answer from the records shared with you. In them I find one rapid rise on PHQ-9 and no item 9 signal [1]. Sources: [1] PHQ-9 session 20 Nov 14:05.",
  "I can't find evidence for this in the shared records. Ask about scores, flags or what the person wrote in chat.",
];

export default function Assistant() {
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-8 px-6 py-8">
      <PageHeader title="Assistant" sub="Answers from the records people shared with you, with a source for every claim. It does not diagnose." />
      <ChatThread initial={initial} replies={replies} placeholder="Ask about the records you can see." />
    </div>
  );
}
