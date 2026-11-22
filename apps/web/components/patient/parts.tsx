import Link from "next/link";
import { cn } from "@/lib/cn";
import { crisisResources } from "@/lib/crisis/resources";

/** Check-in answer. Full width, 56 px, keyboard hint on the right (Design-System §3). */
export function AnswerOption({ label, hint, selected, onSelect }: { label: string; hint: number; selected?: boolean; onSelect?: () => void }) {
  return (
    <button type="button" role="radio" aria-checked={Boolean(selected)} onClick={onSelect}
      className={cn("relative flex h-14 w-full items-center justify-between rounded-md border px-5 text-left text-lg",
        selected ? "border-accent bg-accent-subtle before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-accent"
          : "border-line-strong bg-surface hover:bg-sunken")}>
      <span>{label}</span>
      <kbd className="rounded-sm border border-line px-1.5 font-mono text-[13px] text-muted">{hint}</kbd>
    </button>
  );
}

export const bandLabels = ["Few signs", "Some", "Noticeable", "High", "Very high"];
const spans = [5, 5, 5, 5, 8];

/** Segmented bar, no colour ramp. Active segment in neel, the score marker is the nuqta (Design-System §3). */
export function ResultBand({ score, max, active }: { score: number; max: number; active: number }) {
  return (
    <figure className="flex flex-col gap-3" aria-label={`Score ${score} of ${max}`}>
      <div className="relative">
        <div className="flex gap-1">
          {spans.map((s, i) => (
            <div key={i} style={{ flexGrow: s }} className={cn("h-3 basis-0 rounded-sm", i === active ? "bg-accent" : "bg-line-strong")} />
          ))}
        </div>
        <span aria-hidden className="absolute -top-2 size-4 -translate-x-1/2 rotate-45 bg-nuqta"
          style={{ left: `${(score / max) * 100}%` }} />
      </div>
      <div className="flex gap-1 text-[13px] text-muted">
        {bandLabels.map((l, i) => (
          <span key={l} style={{ flexGrow: spans[i] }} className={cn("basis-0", i === active && "font-medium text-ink")}>{l}</span>
        ))}
      </div>
      <figcaption className="font-mono text-[13px] text-muted tnum">Score {score} of {max}</figcaption>
    </figure>
  );
}

/** Persistent strip after a safety pathway. Paper background, ink text (Design-System §3). */
export function ResourcesStrip() {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-line-strong bg-sunken px-6 py-2.5 text-sm">
      <span className="text-ink">
        If you need someone now:{" "}
        {crisisResources.slice(0, 2).map((r, i) => (
          <span key={r.name}>{i > 0 && ", "}{r.name} <a className="font-mono underline underline-offset-4" href={`tel:${r.tel}`}>{r.display}</a></span>
        ))}
      </span>
      <Link href="/help" className="font-medium text-accent underline underline-offset-4">Get help now</Link>
    </div>
  );
}
