"use client";
import { useEffect, useState } from "react";
import { ButtonLink, Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/** Head-and-shoulders guide: oval for the face, eye line, thirds grid. Drawn, not a photo. */
export function FramingGuide({ active }: { active: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-line-strong bg-sunken">
      <svg viewBox="0 0 640 360" className="w-full" role="img" aria-label="Framing guide: face inside the oval, eyes on the line, shoulders at the bottom edge">
        <g className="stroke-line-strong" strokeDasharray="4 6" strokeWidth="1">
          <path d="M213 0V360M427 0V360M0 120H640M0 240H640" />
        </g>
        <ellipse cx="320" cy="150" rx="92" ry="118" fill="none" strokeWidth="3" className={active ? "stroke-accent" : "stroke-slate"} style={{ stroke: active ? undefined : "var(--border-strong)" }} />
        <path d="M228 150H412" strokeWidth="2" className="stroke-accent" strokeDasharray="2 6" />
        <text x="420" y="146" className="fill-ink-2 text-[14px]">Eyes on this line</text>
        <path d="M120 360C130 292 200 268 320 268C440 268 510 292 520 360" fill="none" strokeWidth="3" className="stroke-line-strong" />
        <text x="530" y="335" className="fill-ink-2 text-[14px]">Shoulders</text>
        <path d="M320 8V26M312 8H328" strokeWidth="2" className="stroke-ink-2" />
        <text x="336" y="24" className="fill-ink-2 text-[14px]">A little space above your head</text>
      </svg>
      {!active && <p className="absolute inset-x-0 bottom-3 text-center text-sm text-muted">Your camera preview appears here after you turn it on.</p>}
    </div>
  );
}

const checks = [
  "Face is inside the oval",
  "Eyes are near the line",
  "You are about an arm's length away",
  "Light is in front of you, not behind",
  "Only you are in the frame",
];

export function CameraCheck({ next }: { next: string }) {
  const [on, setOn] = useState(false);
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (!on || done >= checks.length) return;
    const t = setTimeout(() => setDone((d) => d + 1), 1100);
    return () => clearTimeout(t);
  }, [on, done]);
  const ready = done >= checks.length;
  return (
    <div className="grid grid-cols-[1.4fr_1fr] gap-10">
      <FramingGuide active={on} />
      <div className="flex flex-col gap-6">
        <ul className="flex flex-col gap-3">
          {checks.map((c, i) => {
            const ok = i < done;
            return (
              <li key={c} className={cn("flex items-center gap-3 text-lg", ok ? "text-ink" : "text-muted")}>
                <span aria-hidden className={cn("grid size-6 place-items-center rounded-sm border text-sm", ok ? "border-accent bg-accent text-on-accent" : "border-line-strong")}>{ok ? "✓" : ""}</span>
                {c}{on && !ok && i === done && <span className="text-sm text-muted">Checking</span>}
              </li>
            );
          })}
        </ul>
        {!on
          ? <Button size="lg" onClick={() => setOn(true)}>Turn on camera</Button>
          : ready ? <ButtonLink href={next} size="lg">Next: check the sound</ButtonLink>
            : <Button size="lg" variant="secondary" disabled>Adjusting</Button>}
        <p className="text-sm text-ink-2">The camera starts only when you click. Video is read on your device for blinking and gaze. It is not uploaded unless you turned on research recordings in Settings.</p>
      </div>
    </div>
  );
}
