import { cn } from "@/lib/cn";

/** Dense table: sticky header, 44 px rows, tabular numbers (Design-System §3). */
export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-line", className)}>
      <table className="w-full border-collapse text-left text-[14px] tnum">{children}</table>
    </div>
  );
}
export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th scope="col" className={cn("sticky top-0 h-10 border-b border-line bg-sunken px-4 text-[13px] font-medium text-muted", className)}>{children}</th>;
}
export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("h-11 border-b border-line px-4 align-middle", className)}>{children}</td>;
}

export function Segmented({ label, options, active }: { label: string; options: string[]; active: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-md border border-line-strong p-0.5 text-sm">
      {options.map((o) => (
        <span key={o} aria-current={o === active ? "true" : undefined}
          className={cn("rounded-sm px-3 py-1", o === active ? "bg-accent-selected font-medium text-accent" : "text-ink-2")}>{o}</span>
      ))}
    </div>
  );
}
