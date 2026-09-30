import { ChatMessage, Composer } from "@/components/chat";
import { ButtonLink } from "@/components/ui/button";
import { IconCheck } from "@/components/icons-extra";
import { cn } from "@/lib/cn";

export const metadata = { title: "Interview" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ session: "demo" }]; }

const areas = [["Rapport and opening", true], ["Presenting problem", true], ["Risk assessment", false], ["History and context", false], ["Closing", false]] as const;

export default function Interview() {
  return (
    <div className="grid min-h-[calc(100vh-56px)] grid-cols-[1fr_320px]">
      <section className="flex min-w-0 flex-col gap-6 px-8 py-8">
        <details className="rounded-md border border-line px-4 py-3 text-sm">
          <summary className="cursor-pointer font-medium">Case card</summary>
          <p className="mt-2 text-ink-2">Community clinic. First intake. The client is a teacher in her thirties who has come at her sister&apos;s suggestion.</p>
        </details>
        <div className="flex flex-1 flex-col gap-5 pb-4">
          <ChatMessage from="user">Hello, I&apos;m Bilal. Thanks for coming in. What brings you here today?</ChatMessage>
          <ChatMessage from="assistant">Hello. My sister said I should talk to someone. I&apos;m just tired all the time, and I don&apos;t know why.</ChatMessage>
          <ChatMessage from="user">Can you tell me a bit more about when the tiredness began?</ChatMessage>
          <ChatMessage from="assistant">Maybe four or five months ago. After the school term changed. I get through the day and then I have nothing left.</ChatMessage>
        </div>
        <Composer placeholder="Ask your next question." />
      </section>
      <aside className="flex flex-col gap-6 border-l border-line bg-sunken px-6 py-8">
        <div className="flex flex-col gap-1"><p className="text-sm text-muted">Time left</p><p className="font-mono text-4xl tnum">14:32</p></div>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-muted">Areas covered</p>
          <ul className="flex flex-col gap-2">
            {areas.map(([a, done]) => (
              <li key={a} className={cn("flex items-center gap-2 text-[15px]", done ? "text-ink" : "text-muted")}>
                <span className={cn("grid size-5 place-items-center rounded-sm border", done ? "border-accent bg-accent text-on-accent" : "border-line-strong")}>{done && <IconCheck width={14} height={14} />}</span>{a}
              </li>
            ))}
          </ul>
        </div>
        <ButtonLink href="/scholar/sim/demo/debrief" variant="secondary" className="mt-auto">End interview</ButtonLink>
      </aside>
    </div>
  );
}
