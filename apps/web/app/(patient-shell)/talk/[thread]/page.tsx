import Link from "next/link";
import { ChatThread } from "@/components/chat";
import { Suggestion } from "@/components/islands/patient";

export const metadata = { title: "Talk" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ thread: "demo" }]; }

const initial = [
  { from: "user" as const, text: "i haven't slept properly in days" },
  { from: "assistant" as const, text: "That sounds exhausting. Days without proper sleep wear a person down. What has been keeping you up: your mind racing, your schedule, or something else?" },
  { from: "user" as const, text: "night shifts at work, and my mind keeps going over money" },
  { from: "assistant" as const, text: "Night shifts and money worries can feed each other. Would it help to take a short check-in about sleep? It takes about three minutes, and you decide whether your psychologist sees the result." },
];

// Demo replies. The real counselor is an LLM behind the crisis check and output guard.
const replies = [
  "Thank you for telling me that. What part of it feels heaviest right now?",
  "That makes sense. What has helped, even a little, on the days that felt easier?",
  "I hear you. Would you like to try one small thing tonight, like a wind-down routine, or would you rather keep talking?",
];

export default function Thread() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-[680px] flex-col px-6">
      <div className="flex items-center justify-between border-b border-line py-3 text-sm text-ink-2">
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-line-strong" aria-hidden />Camera off</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-line-strong" aria-hidden />Mic off</span>
        </span>
        <Link href="/talk" className="text-accent underline underline-offset-4">End chat</Link>
      </div>
      <ChatThread className="flex-1 py-8 pb-6" initial={initial} replies={replies} placeholder="Write a message. Enter sends, Shift+Enter adds a line.">
        <Suggestion href="/check-in/demo/setup" cta="Yes, start" dismissedNote="No problem. The offer stays in Check in whenever you want it."
          className="flex max-w-[80%] flex-col gap-4 rounded-lg border border-line-strong p-5">
          <p className="text-base">Take a 7-question sleep check-in?</p>
        </Suggestion>
      </ChatThread>
    </div>
  );
}
