import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Why we ask" };

export default function IntakeWhy() {
  return (
    <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col justify-center gap-8 px-6 py-16">
      <h1 className="font-serif text-[44px] leading-tight">A few questions about your life</h1>
      <div className="flex flex-col gap-4 text-lg text-ink-2">
        <p>Sleep, money, work and the people around you all shape how you feel. Seven short questions let your check-ins be read in that light.</p>
        <p>Every question has a &ldquo;Prefer not to say&rdquo; option. Your answers save as you go, and you can go back at any time.</p>
      </div>
      <div><ButtonLink href="/intake" size="lg">Start</ButtonLink></div>
    </main>
  );
}
