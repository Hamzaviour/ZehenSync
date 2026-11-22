import { PrototypeStates } from "@/components/prototype-states";
import { voiceStates } from "@/components/patient/runner-states";
import { SoundCheck } from "@/components/voice/sound-check";

export const metadata = { title: "Check the sound" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ session: "demo" }]; }

export default function Sound() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col gap-8 px-6 py-14">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-sm text-muted">Step 2 of 2</p>
          <h1 className="font-serif text-[44px] leading-tight">Find a quiet place</h1>
          <p className="text-lg text-ink-2">You will answer a few questions out loud. A quiet room lets your voice be heard properly.</p>
        </div>
        <SoundCheck next="/check-in/demo/voice/interview" />
      </main>
      <PrototypeStates current="/check-in/demo/voice/sound" items={voiceStates} />
    </>
  );
}
