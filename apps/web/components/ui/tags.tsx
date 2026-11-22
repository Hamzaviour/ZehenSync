import { cn } from "@/lib/cn";

export type Severity = "crisis" | "urgent" | "watch" | "info";

const sev = {
  crisis: { mark: "●", label: "Crisis", cls: "bg-crisis-fill text-crisis" },
  urgent: { mark: "◆", label: "Urgent", cls: "bg-urgent-fill text-urgent" },
  watch: { mark: "▲", label: "Watch", cls: "bg-watch-fill text-watch" },
  info: { mark: "○", label: "Info", cls: "bg-sunken text-ink-2" },
} as const;

/** Clinician and admin screens only. Shape, colour and word together. */
export function SeverityTag({ level }: { level: Severity }) {
  const s = sev[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[13px] font-medium", s.cls)}>
      <span aria-hidden>{s.mark}</span>{s.label}
    </span>
  );
}

export function DeltaChip({ delta }: { delta: number }) {
  const up = delta > 0;
  return (
    <span className={cn("font-mono tnum text-[13px]",
      delta >= 5 ? "text-urgent" : delta <= -5 ? "text-steady" : "text-ink-2")}>
      {delta === 0 ? "→ 0" : `${up ? "↑" : "↓"} ${Math.abs(delta).toFixed(1)}`} <span className="text-muted">vs baseline</span>
    </span>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" | "steady" | "watch" }) {
  return (
    <span className={cn("inline-flex items-center rounded-sm px-2 py-0.5 text-[13px]",
      tone === "neutral" && "bg-sunken text-ink-2",
      tone === "accent" && "bg-accent-selected text-accent",
      tone === "steady" && "bg-steady-fill text-steady",
      tone === "watch" && "bg-watch-fill text-watch")}>
      {children}
    </span>
  );
}

/** Marks placeholder numbers so none reads as real (Brand-Kit anti-slop). */
export function DemoTag() {
  return (
    <span className="rounded-sm border border-line-strong px-1.5 py-0.5 font-mono text-[12px] text-muted">Demo data</span>
  );
}
