import { PrototypeStates } from "@/components/prototype-states";
import { voiceStates } from "@/components/patient/runner-states";
import { CameraCheck } from "@/components/voice/camera-check";

export const metadata = { title: "Set up your camera" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ session: "demo" }]; }

export default function Camera() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col gap-8 px-6 py-14">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-sm text-muted">Step 1 of 2</p>
          <h1 className="font-serif text-[44px] leading-tight">Sit so the camera can see you</h1>
          <p className="text-lg text-ink-2">Line yourself up with the guide. This helps the measurements be accurate, and it takes a few seconds.</p>
        </div>
        <CameraCheck next="/check-in/demo/voice/sound" />
      </main>
      <PrototypeStates current="/check-in/demo/voice/camera" items={voiceStates} />
    </>
  );
}
