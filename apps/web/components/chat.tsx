"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Msg = { from: "assistant" | "user"; text: string };

/** Assistant text sits on the page with no bubble; the person's message is a tinted block (Design-System §3). */
export function ChatMessage({ from, children }: { from: "assistant" | "user"; children: React.ReactNode }) {
  return from === "assistant"
    ? <div className="max-w-[80%] text-lg leading-relaxed">{children}</div>
    : <div className="ml-auto max-w-[80%] rounded-md bg-accent-subtle px-4 py-3 text-lg">{children}</div>;
}

/**
 * Local-only conversation. Sends append your message and a canned reply after a short pause.
 * The API replaces `replies` later.
 */
export function ChatThread({ initial, replies, placeholder, children, className, leading }: {
  initial: Msg[]; replies: string[]; placeholder: string; children?: React.ReactNode; className?: string; leading?: React.ReactNode;
}) {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const n = useRef(0);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { if (msgs.length > initial.length) end.current?.scrollIntoView({ block: "end", behavior: "smooth" }); }, [msgs, initial.length]);

  function send() {
    const t = text.trim();
    if (!t || busy) return;
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setText("");
    setBusy(true);
    const reply = replies[n.current++ % replies.length]!;
    setTimeout(() => { setMsgs((m) => [...m, { from: "assistant", text: reply }]); setBusy(false); }, 700);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {leading}
      <div className="flex flex-col gap-6">
        {msgs.map((m, i) => <ChatMessage key={i} from={m.from}>{m.text}</ChatMessage>)}
        {busy && <p className="text-muted" aria-live="polite">Writing a reply</p>}
        {children}
        <div ref={end} />
      </div>
      <div className="sticky bottom-0 flex items-end gap-2 rounded-lg border border-line-strong bg-surface p-2">
        <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} aria-label="Message"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-base placeholder:text-muted focus:outline-none" />
        <button type="button" onClick={send} disabled={!text.trim() || busy}
          className="h-10 rounded-md bg-accent px-4 font-medium text-on-accent hover:bg-accent-hover disabled:opacity-50">Send</button>
      </div>
    </div>
  );
}
