import { cn } from "@/lib/cn";

export function Alert({ tone = "info", children, className }: {
  tone?: "info" | "error" | "success"; children: React.ReactNode; className?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-md border px-4 py-3 text-sm",
        tone === "info" && "border-line bg-accent-subtle text-ink",
        tone === "error" && "border-crisis/30 bg-crisis-fill text-crisis",
        tone === "success" && "border-steady/30 bg-steady-fill text-steady",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** One sentence, one action. No illustration. */
export function EmptyState({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border border-dashed border-line-strong bg-sunken px-6 py-8">
      <p className="text-base text-ink">{children}</p>
      {action}
    </div>
  );
}
