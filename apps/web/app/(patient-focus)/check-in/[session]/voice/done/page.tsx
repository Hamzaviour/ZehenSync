import { PrototypeStates } from "@/components/prototype-states";
import { voiceStates } from "@/components/patient/runner-states";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Thank you" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ session: "demo" }]; }

export default function Done() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col gap-8 px-6 py-16">
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-[44px] leading-tight">Thank you. That was 5 questions.</h1>
          <p className="text-lg text-ink-2">It took about 6 minutes. You said a lot, and it helps.</p>
        </div>
        <section className="flex flex-col gap-3 rounded-lg border border-line p-6">
          <h2 className="font-serif text-2xl">What happens now</h2>
          <ul className="list-disc space-y-2 pl-5 text-base text-ink-2">
            <li>Your device measures speech pace, pauses, blinking and gaze. The camera and microphone are now off.</li>
            <li>Your recording is deleted after the measurements are made, unless you agreed to research recordings.</li>
            <li>Your psychologist sees the measurements only if you share them. They add context and never raise a flag on their own.</li>
            <li>Your score comes only from the standard questions, not from what you said.</li>
          </ul>
        </section>
        <div className="flex gap-3"><ButtonLink href="/home" size="lg">Back to home</ButtonLink><ButtonLink href="/sharing" variant="secondary" size="lg">Sharing</ButtonLink></div>
      </main>
      <PrototypeStates current="/check-in/demo/voice/done" items={voiceStates} />
    </>
  );
}
