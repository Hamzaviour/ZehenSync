import { cn } from "@/lib/cn";

/** Superscript number, mono, neel. 44 px hit area, source title on hover (Design-System §3). */
export function CitationMark({ n, title }: { n: number; title: string }) {
  return (
    <a href={`#ref-${n}`} title={title} className="relative mx-0.5 align-super font-mono text-[12px] text-accent before:absolute before:-inset-3 before:content-['']">
      [{n}]
    </a>
  );
}

export type Reference = { n: number; title: string; where: string; quote: string; cited: string; tier: string };

/** Sticky sidebar. The active source is highlighted; the cited sentence is underlined inside the quote. */
export function ReferencePanel({ refs, active }: { refs: Reference[]; active: number }) {
  return (
    <aside aria-label="References" className="sticky top-6 flex w-[380px] shrink-0 flex-col gap-3 self-start">
      <h2 className="text-sm font-medium text-muted">References</h2>
      {refs.map((r) => (
        <article key={r.n} id={`ref-${r.n}`}
          className={cn("flex flex-col gap-2 rounded-lg border p-4", r.n === active ? "border-accent bg-accent-subtle" : "border-line")}>
          <p className="flex items-baseline justify-between gap-3"><span className="font-medium">[{r.n}] {r.title}</span><span className="shrink-0 font-mono text-[12px] text-muted">{r.where}</span></p>
          <p className="font-serif text-base leading-relaxed text-ink-2">
            {r.quote.split(r.cited)[0]}<u className="decoration-accent decoration-2 underline-offset-4 text-ink">{r.cited}</u>{r.quote.split(r.cited)[1]}
          </p>
          <p className="font-mono text-[12px] text-muted">{r.tier}</p>
        </article>
      ))}
    </aside>
  );
}
