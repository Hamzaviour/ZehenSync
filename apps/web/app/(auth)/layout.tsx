import Link from "next/link";
import { Lockup, PrototypeLink } from "@/components/brand";
import { DemoTag } from "@/components/ui/tags";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b border-line px-6">
        <Link href="/"><Lockup className="h-6 w-auto" /></Link>
        <div className="flex items-center gap-4"><DemoTag /><PrototypeLink /></div>
      </header>
      <main className="flex flex-1 justify-center px-6 py-16">{children}</main>
      <footer className="border-t border-line px-6 py-4 text-[13px] text-muted">
        ZehenSync screens and never diagnoses. A licensed psychologist makes every clinical decision.
      </footer>
    </div>
  );
}
