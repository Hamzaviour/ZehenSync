"use client";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/** Mock level meter. The real one reads the microphone on the device. */
export function LevelMeter({ level, bars = 28 }: { level: number; bars?: number }) {
  return (
    <div className="flex h-16 items-end gap-1" aria-hidden>
      {Array.from({ length: bars }, (_, i) => {
        const h = Math.max(6, Math.round(level * (0.35 + 0.65 * Math.abs(Math.sin(i * 1.7 + level * 9))) * 64));
        return <span key={i} style={{ height: h }} className="w-2 rounded-sm bg-accent" />;
      })}
    </div>
  );
}

export function SoundCheck({ next }: { next: string }) {
  const [phase, setPhase] = useState<"idle" | "measuring" | "done">("idle");
  const [left, setLeft] = useState(5);
  const [level, setLevel] = useState(0.05);
  useEffect(() => {
    if (phase !== "measuring") return;
    const tick = setInterval(() => { setLevel(0.04 + Math.random() * 0.06); setLeft((l) => l - 0.2); }, 200);
    const end = setTimeout(() => { setPhase("done"); setLevel(0.05); }, 5000);
    return () => { clearInterval(tick); clearTimeout(end); };
  }, [phase]);
  return (
    <div className="grid grid-cols-[1.4fr_1fr] gap-10">
      <div className="flex flex-col gap-5 rounded-lg border border-line-strong p-6">
        <p className="text-sm text-muted">Room sound</p>
        <LevelMeter level={phase === "idle" ? 0.03 : level} />
        <p className={cn("text-lg", phase === "done" ? "text-ink" : "text-ink-2")}>
          {phase === "idle" && "Stay quiet for 5 seconds so we can hear the room."}
          {phase === "measuring" && <>Stay quiet. <span className="font-mono tnum">{Math.max(0, Math.ceil(left))}</span> seconds left.</>}
          {phase === "done" && "Quiet enough. Your voice will come through clearly."}
        </p>
        {phase !== "measuring" && <div><Button variant={phase === "done" ? "secondary" : "primary"} onClick={() => { setLeft(5); setPhase("measuring"); }}>{phase === "done" ? "Check again" : "Turn on microphone and check"}</Button></div>}
      </div>
      <div className="flex flex-col gap-6">
        <ul className="list-disc space-y-2 pl-5 text-lg text-ink-2">
          <li>Sit somewhere quiet and close the door.</li>
          <li>Silence your phone and turn off the TV or fan if you can.</li>
          <li>Speak in your normal voice. You do not need to speak up.</li>
        </ul>
        {phase === "done"
          ? <ButtonLink href={next} size="lg">Start the session</ButtonLink>
          : <Button size="lg" variant="secondary" disabled>Start the session</Button>}
        <p className="text-sm text-ink-2">The microphone starts only when you click. Audio is used to measure speech pace and pauses, then deleted unless you agreed to research recordings.</p>
      </div>
    </div>
  );
}
