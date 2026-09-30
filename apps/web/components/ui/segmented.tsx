"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function Segmented({ label, options, active, onChange }: {
  label: string; options: string[]; active: string; onChange?: (v: string) => void;
}) {
  const [value, setValue] = useState(active);
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-md border border-line-strong p-0.5 text-sm">
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={o === value} onClick={() => { setValue(o); onChange?.(o); }}
          className={cn("rounded-sm px-3 py-1", o === value ? "bg-accent-selected font-medium text-accent" : "text-ink-2 hover:text-ink")}>{o}</button>
      ))}
    </div>
  );
}
