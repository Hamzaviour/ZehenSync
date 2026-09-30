import { ButtonLink } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form";
import { PrototypeStates } from "@/components/prototype-states";
import { runnerStates } from "@/components/patient/runner-states";

export const metadata = { title: "Before we start" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ session: "demo" }]; }

export default function Setup() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col gap-8 px-6 py-16">
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-[44px] leading-tight">Low mood check-in</h1>
          <p className="text-lg text-ink-2">9 questions, about 3 minutes. Answer for the last 2 weeks. There are no right answers, and you can stop at any point.</p>
        </div>
        <section className="flex flex-col gap-5 rounded-lg border border-line p-6">
          <h2 className="font-serif text-2xl">Camera and microphone</h2>
          <p className="text-base text-ink-2">Optional. If you turn the camera on, your browser measures blinking and gaze on your device. The video never leaves your device.</p>
          <Checkbox id="camera" label="Use my camera" description="A dot shows while it is on, and one click pauses it." />
          <Checkbox id="mic" label="Use my microphone" description="For voice notes in this check-in only." />
        </section>
        <div><ButtonLink href="/check-in/demo" size="lg">Start</ButtonLink></div>
      </main>
      <PrototypeStates current="/check-in/demo/setup" items={runnerStates} />
    </>
  );
}
