import { cn } from "@/lib/cn";

/** Assistant text sits on the page with no bubble; the person's message is a tinted block (Design-System §3). */
export function ChatMessage({ from, children }: { from: "assistant" | "user"; children: React.ReactNode }) {
  return from === "assistant"
    ? <div className="max-w-[80%] text-lg leading-relaxed">{children}</div>
    : <div className="ml-auto max-w-[80%] rounded-md bg-accent-subtle px-4 py-3 text-lg">{children}</div>;
}

export function Composer({ placeholder, className }: { placeholder: string; className?: string }) {
  return (
    <div className={cn("flex items-end gap-2 rounded-lg border border-line-strong bg-surface p-2", className)}>
      <textarea rows={2} placeholder={placeholder} aria-label="Message"
        className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-base placeholder:text-muted focus:outline-none" />
      <button type="button" className="h-10 rounded-md bg-accent px-4 font-medium text-on-accent hover:bg-accent-hover">Send</button>
    </div>
  );
}
