import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Brief" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ session: "demo" }]; }

export default function Brief() {
  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-col gap-8 px-6 py-12">
      <h1 className="font-serif text-[32px] leading-tight">A teacher who is always tired</h1>
      <dl className="grid grid-cols-[140px_1fr] gap-y-3 text-lg">
        <dt className="text-muted">Setting</dt><dd>Community clinic</dd>
        <dt className="text-muted">Your role</dt><dd>Clinical student, first intake interview</dd>
        <dt className="text-muted">Time limit</dt><dd>20 minutes</dd>
        <dt className="text-muted">Rubric</dt><dd>Shown as you go. Switch to exam mode to hide it.</dd>
      </dl>
      <p className="text-base text-ink-2">The client is played by an AI and answers in character. The case card stays hidden during the interview.</p>
      <div><ButtonLink href="/scholar/sim/demo" size="lg">Start interview</ButtonLink></div>
    </div>
  );
}
