import Link from "next/link";
import { MarkMono } from "@/components/brand";
import { IconHelpNow } from "@/components/icons";
import { DemoTag } from "@/components/ui/tags";

/** Focus screens: intake and check-in. One thing on the page, no sidebar, no saffron of its own. */
export default function PatientFocusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b border-line px-6">
        <Link href="/home" aria-label="Back to home" className="text-ink"><MarkMono /></Link>
        <div className="flex items-center gap-5">
          <DemoTag />
          <Link href="/help" className="inline-flex items-center gap-2 rounded-md border border-line-strong px-3 py-1.5 text-sm font-medium hover:bg-sunken">
            <IconHelpNow width={18} height={18} />Get help now
          </Link>
          <Link href="/home" className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink">Save and exit</Link>
        </div>
      </header>
      {children}
    </div>
  );
}
