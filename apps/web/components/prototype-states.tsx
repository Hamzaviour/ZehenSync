import Link from "next/link";
import { cn } from "@/lib/cn";

/** Prototype-only row that jumps between states of one flow. Not part of the product UI. */
export function PrototypeStates({ label = "States in this flow", items, current }: {
  label?: string; items: { href: string; label: string }[]; current: string;
}) {
  return (
    <nav aria-label={label} className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-dashed border-line-strong px-6 py-3 font-mono text-[12px] text-muted">
      <span>Prototype · {label}:</span>
      {items.map((i) => (
        <Link key={i.href} href={i.href} aria-current={i.href === current ? "page" : undefined}
          className={cn("underline-offset-4 hover:text-ink hover:underline", i.href === current && "text-accent underline")}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
