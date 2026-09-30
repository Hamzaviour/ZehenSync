"use client";
import { useState } from "react";
import { ButtonLink, Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/form";
import { Pill } from "@/components/ui/tags";
import { useToast } from "@/components/ui/toast";

/** Home card and chat card share this shape: a suggestion with Start and Not now. */
export function Suggestion({ children, href, cta, dismissedNote, className }: {
  children: React.ReactNode; href: string; cta: string; dismissedNote: string; className?: string;
}) {
  const [gone, setGone] = useState(false);
  if (gone) return <p className="text-ink-2">{dismissedNote}</p>;
  return (
    <div className={className}>
      {children}
      <div className="flex gap-3">
        <ButtonLink href={href} size="lg">{cta}</ButtonLink>
        <Button variant="quiet" size="lg" onClick={() => setGone(true)}>Not now</Button>
      </div>
    </div>
  );
}

const scopes: [string, string, string][] = [
  ["name", "Name and contact", "Your name and email."],
  ["scores", "Scores", "The number and wording from each check-in."],
  ["flags", "How answers led to flags", "The answers behind anything your psychologist is asked to look at."],
  ["chat", "Chat transcripts", "What you and the counselor wrote."],
  ["signals", "Camera and voice measurements", "Only if you turned these on during a check-in."],
  ["background", "Background", "Your answers about work, money, sleep and support."],
];

type Link = { who: string; scopes: string; since: string };

export function SharingPanel() {
  const toast = useToast();
  const [code, setCode] = useState("");
  const [found, setFound] = useState(false);
  const [chosen, setChosen] = useState<Set<string>>(new Set(["scores", "flags"]));
  const [links, setLinks] = useState<Link[]>([]);
  const [confirm, setConfirm] = useState(false);

  function share() {
    const names = scopes.filter(([id]) => chosen.has(id)).map(([, l]) => l).join(", ");
    setLinks([{ who: "Dr. A. Khan", scopes: names || "Nothing yet", since: "linked today" }]);
    setFound(false); setCode("");
    toast("Now sharing with Dr. A. Khan");
  }

  return (
    <>
      <section className="flex flex-col gap-5 rounded-lg border border-line-strong p-6">
        <h2 className="font-serif text-2xl">Link to a psychologist</h2>
        <Field label="Invite code" htmlFor="code" hint="Your psychologist gives you this code. Demo: use KHN-4827.">
          <div className="flex gap-3">
            <Input id="code" value={code} onChange={(e) => { setCode(e.target.value); setFound(false); }} className="w-56 font-mono" placeholder="ABC-123" />
            <Button variant="secondary" onClick={() => code.trim().toUpperCase() === "KHN-4827" ? setFound(true) : toast("That code was not found. Check it and try again.")}>Find</Button>
          </div>
        </Field>
        {found && (
          <>
            <div className="flex items-center justify-between rounded-md bg-sunken px-4 py-3">
              <span className="flex flex-col"><span className="font-medium">Dr. A. Khan</span><span className="text-sm text-ink-2">Fountain House Clinic, Lahore</span></span>
              <Pill tone="steady">Verified psychologist</Pill>
            </div>
            <fieldset className="flex flex-col gap-4">
              <legend className="mb-1 text-sm font-medium">What they can see</legend>
              {scopes.map(([id, label, desc]) => (
                <div key={id} onChange={(e) => setChosen((s) => { const n = new Set(s); if ((e.target as HTMLInputElement).checked) n.add(id); else n.delete(id); return n; })}>
                  <Checkbox id={id} label={label} description={desc} defaultChecked={chosen.has(id)} />
                </div>
              ))}
            </fieldset>
            <div><Button size="lg" onClick={share}>Share with Dr. A. Khan</Button></div>
          </>
        )}
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted">Who can see your data now</h2>
        {links.length === 0 && <p className="rounded-lg border border-dashed border-line-strong bg-sunken px-5 py-4 text-ink-2">No one yet.</p>}
        {links.map((l) => (
          <div key={l.who} className="flex items-center justify-between rounded-lg border border-line p-5">
            <span className="flex flex-col gap-1"><span className="text-lg">{l.who}</span><span className="text-sm text-ink-2">{l.scopes} · {l.since}</span></span>
            {confirm ? (
              <span className="flex items-center gap-3 text-sm">Stop sharing?
                <Button onClick={() => { setLinks([]); setConfirm(false); toast("Stopped sharing with " + l.who); }}>Yes, stop</Button>
                <Button variant="secondary" onClick={() => setConfirm(false)}>Keep</Button></span>
            ) : <Button variant="secondary" onClick={() => setConfirm(true)}>Stop sharing</Button>}
          </div>
        ))}
      </section>
    </>
  );
}
