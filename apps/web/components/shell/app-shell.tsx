import Link from "next/link";
import { Lockup, PrototypeLink } from "@/components/brand";
import { IconHelpNow } from "@/components/icons";
import { DemoTag } from "@/components/ui/tags";
import { account, roleLabel, type Role } from "./nav";
import { NavLinks } from "./nav-links";

/** 240 px sidebar, 56 px top bar (Design-System §2). The page supplies its own width. */
export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const who = account[role];
  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <aside className="flex flex-col gap-6 border-r border-line bg-sunken px-3 py-4">
        <Link href={role === "patient" ? "/home" : `/${role}`} className="px-3">
          <Lockup className="h-6 w-auto" />
        </Link>
        <NavLinks role={role} />
        <div className="mt-auto px-3 text-[13px] text-muted">
          Screening support only. A licensed psychologist makes every clinical decision.
        </div>
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-line px-6">
          <div className="flex items-center gap-3 text-sm text-ink-2">
            {roleLabel[role] && <span className="font-medium text-ink">{roleLabel[role]}</span>}
            <DemoTag />
          </div>
          <div className="flex items-center gap-5">
            <PrototypeLink />
            {role === "patient" && (
              <Link href="/help" className="inline-flex items-center gap-2 rounded-md border border-line-strong px-3 py-1.5 text-sm font-medium text-ink hover:bg-sunken">
                <IconHelpNow width={18} height={18} />Get help now
              </Link>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="grid size-8 place-items-center rounded-full bg-accent-selected font-medium text-accent" aria-hidden>{who.name[0]}</span>
              <span className="leading-tight"><span className="block font-medium">{who.name}</span><span className="block text-[13px] text-muted">{who.note}</span></span>
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

/** Patient column: single column, max 680 px, centred (Design-System §2). */
export function PatientColumn({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex w-full max-w-[680px] flex-col gap-8 px-6 py-12">{children}</div>;
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-[32px] leading-tight font-normal">{title}</h1>
        {sub && <p className="text-base text-ink-2">{sub}</p>}
      </div>
      {actions}
    </div>
  );
}
