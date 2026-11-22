import { IconChevron } from "@/components/icons-extra";
import { cn } from "@/lib/cn";

/** One piece of evidence: timestamp, source, exact stored value. Expands to canonical vs displayed wording. */
export function TraceRow({ when, source, summary, value, trigger, children }: {
  when: string; source: string; summary: string; value?: string; trigger?: boolean; children?: React.ReactNode;
}) {
  return (
    <details className="group border-b border-line last:border-b-0" open={trigger}>
      <summary className="flex h-12 cursor-pointer list-none items-center gap-4 px-4 hover:bg-sunken [&::-webkit-details-marker]:hidden">
        <span aria-hidden className={cn("text-lg leading-none", trigger ? "text-accent" : "text-muted")}>{trigger ? "●" : "○"}</span>
        <span className="w-32 shrink-0 font-mono text-[13px] text-ink-2">{when}</span>
        <span className="w-28 shrink-0 text-[13px] text-muted">{source}</span>
        <span className="flex-1">{summary}</span>
        {value && <span className="font-mono text-[13px]">{value}</span>}
        <IconChevron width={16} height={16} className="text-muted transition-transform group-open:rotate-90" />
      </summary>
      {children && <div className="border-t border-line bg-sunken px-4 py-4 pl-[68px] text-[14px]">{children}</div>}
    </details>
  );
}
