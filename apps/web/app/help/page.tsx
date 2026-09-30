import Link from "next/link";
import { crisisResources } from "@/lib/crisis/resources";

export const metadata = { title: "Get help now" };

// Full viewport, paper background, ink text. No saffron, no severity colours, no AI text, 150 ms fade only.
export default function Help() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[720px] flex-col justify-center gap-10 px-6 py-16 motion-safe:animate-[fade_150ms_linear]">
      <style>{`@keyframes fade { from { opacity: 0 } to { opacity: 1 } }`}</style>
      <div className="flex flex-col gap-4">
        <h1 className="font-serif text-[44px] leading-tight">You don&apos;t have to handle this alone.</h1>
        <p className="text-xl text-ink-2">Please reach out to someone right now. These services are free and confidential.</p>
      </div>
      <ul className="flex flex-col gap-3">
        {crisisResources.map((r) => (
          <li key={r.name}>
            <a href={`tel:${r.tel}`} className="flex h-16 items-center justify-between rounded-md bg-accent px-6 text-on-accent hover:bg-accent-hover">
              <span className="flex flex-col leading-tight"><span className="text-lg font-medium">{r.name}</span><span className="text-sm opacity-90">{r.detail}</span></span>
              <span className="font-mono text-2xl">{r.display}</span>
            </a>
          </li>
        ))}
      </ul>
      <details className="rounded-md border border-line-strong px-5 py-4">
        <summary className="cursor-pointer text-lg">Contact someone you trust</summary>
        <p className="mt-3 text-base text-ink-2">Call or message a friend or family member and tell them you are not okay. You do not need the right words. Nothing you do here is sent anywhere.</p>
      </details>
      <div className="flex items-center gap-6">
        <Link href="/home" className="inline-flex h-14 items-center rounded-md border border-line-strong px-6 text-lg font-medium hover:bg-sunken">I&apos;m safe right now</Link>
        <Link href="/login" className="text-lg text-ink-2 underline underline-offset-4 hover:text-ink">Leave ZehenSync</Link>
      </div>
      <p className="text-[13px] text-muted">Prototype: the linked psychologist line appears here only when an alert was actually sent.</p>
    </main>
  );
}
