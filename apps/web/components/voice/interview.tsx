"use client";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { LevelMeter } from "./sound-check";

// Open questions for context. They do not replace the standard questions and never produce a score (Rules › Clinical 2).
const questions = [
  { q: "Tell me about how your last week has been.", hint: "Anything that stood out, good or hard." },
  { q: "What has your sleep been like lately?", hint: "When you go to bed, how you wake up, how rested you feel." },
  { q: "What has been on your mind the most?", hint: "Take your time. There is no right answer." },
  { q: "Has anything felt different from how it usually does?", hint: "Energy, appetite, interest in things, how you get on with people." },
  { q: "Who or what helps you when things get hard?", hint: "People, places, habits, anything at all." },
];

const captions = [
  "It has been a long week. Work has been",
  "mostly nights, so I never really get into a rhythm",
  "and I keep thinking about money",
];

type Phase = "asking" | "listening" | "paused";

export function Interview({ done }: { done: string }) {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<Phase>("asking");
  const [secs, setSecs] = useState(0);
  const [level, setLevel] = useState(0.1);
  const last = i === questions.length - 1;

  useEffect(() => {
    if (phase !== "asking") return;
    const t = setTimeout(() => setPhase("listening"), 1800);
    return () => clearTimeout(t);
  }, [phase, i]);
  useEffect(() => {
    if (phase !== "listening") return;
    const t = setInterval(() => { setSecs((s) => s + 1); }, 1000);
    const l = setInterval(() => setLevel(0.15 + Math.random() * 0.6), 180);
    return () => { clearInterval(t); clearInterval(l); };
  }, [phase]);

  function nextQuestion() { setI((n) => n + 1); setSecs(0); setPhase("asking"); }
  const shown = Math.min(captions.length, Math.floor(secs / 2) + (phase === "listening" ? 1 : 0));
  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");

  return (
    <main className="mx-auto grid w-full max-w-[1000px] flex-1 grid-cols-[1fr_260px] gap-12 px-6 py-14">
      <section className="flex flex-col gap-8">
        <p className="font-mono text-sm text-muted tnum">{i + 1} of {questions.length}</p>
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-[32px] leading-snug font-normal">{questions[i]!.q}</h1>
          <p className="text-lg text-ink-2">{questions[i]!.hint}</p>
          <button type="button" className="w-fit text-sm text-accent underline underline-offset-4" onClick={() => setPhase("asking")}>Hear the question again</button>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-line-strong p-6" aria-live="polite">
          {phase === "asking" && <p className="text-lg text-ink-2">Reading the question aloud</p>}
          {phase === "paused" && <p className="text-lg text-ink-2">Paused. Nothing is recording. Resume when you are ready.</p>}
          {phase === "listening" && (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm"><span className="size-2.5 rounded-full bg-ink" aria-hidden />Listening</span>
                <span className="font-mono text-sm tnum text-ink-2">{mm}:{ss}</span>
              </div>
              <LevelMeter level={level} bars={36} />
              <p className="min-h-14 font-serif text-xl leading-snug text-ink-2">{captions.slice(0, shown).join(" ")}</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {last
            ? <ButtonLink href={done} size="lg">Finish</ButtonLink>
            : <Button size="lg" disabled={phase === "asking"} onClick={nextQuestion}>Done answering</Button>}
          {phase === "paused"
            ? <Button size="lg" variant="secondary" onClick={() => setPhase("listening")}>Resume</Button>
            : <Button size="lg" variant="secondary" disabled={phase === "asking"} onClick={() => setPhase("paused")}>Pause</Button>}
          {!last && <Button size="lg" variant="quiet" onClick={nextQuestion}>Skip this question</Button>}
        </div>
      </section>
      <aside className="flex flex-col gap-4">
        <div className="grid aspect-[4/3] place-items-center rounded-lg border border-line-strong bg-sunken text-center text-sm text-muted">
          Camera preview
        </div>
        <p className="flex items-center gap-2 text-sm"><span className={phase === "listening" ? "size-2.5 rounded-full bg-ink" : "size-2.5 rounded-full bg-line-strong"} aria-hidden />{phase === "listening" ? "Camera and microphone on" : "Camera and microphone paused"}</p>
        <p className="text-sm text-ink-2">Spoken answers give your psychologist context. They do not change your score, and nothing here is a diagnosis.</p>
      </aside>
    </main>
  );
}
