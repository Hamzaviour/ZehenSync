import { cn } from "@/lib/cn";

export function AuthPage({ title, sub, width = 440, children }: {
  title: string; sub?: string; width?: 440 | 720; children: React.ReactNode;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-8", width === 440 ? "max-w-[440px]" : "max-w-[720px]")}>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[32px] leading-tight font-normal">{title}</h1>
        {sub && <p className="text-base text-ink-2">{sub}</p>}
      </div>
      {children}
    </div>
  );
}
