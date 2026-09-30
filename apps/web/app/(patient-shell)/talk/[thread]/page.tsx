import Link from "next/link";
import { ChatMessage, Composer } from "@/components/chat";
import { IconVoice } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Talk" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ thread: "demo" }]; }

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
      <div className="flex flex-1 flex-col gap-6 py-8">
        <ChatMessage from="user">i haven&apos;t slept properly in days</ChatMessage>
        <ChatMessage from="assistant">That sounds exhausting. Days without proper sleep wear a person down. What has been keeping you up: your mind racing, your schedule, or something else?</ChatMessage>
        <ChatMessage from="user">night shifts at work, and my mind keeps going over money</ChatMessage>
        <ChatMessage from="assistant">Night shifts and money worries can feed each other. Would it help to take a short check-in about sleep? It takes about three minutes, and you decide whether your psychologist sees the result.</ChatMessage>
        <div className="flex max-w-[80%] flex-col gap-4 rounded-lg border border-line-strong p-5">
          <p className="text-base">Take a 7-question sleep check-in?</p>
          <div className="flex gap-3">
            <ButtonLink href="/check-in/demo/setup">Yes, start</ButtonLink>
            <Button variant="secondary">Not now</Button>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 flex items-end gap-2 bg-bg pb-6">
        <button type="button" aria-label="Hold to talk" className="grid size-12 shrink-0 place-items-center rounded-md border border-line-strong hover:bg-sunken"><IconVoice /></button>
        <Composer className="flex-1" placeholder="Write a message. Enter sends, Shift+Enter adds a line." />
      </div>
    </div>
  );
}
