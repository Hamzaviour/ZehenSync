import Link from "next/link";
import { Lockup } from "@/components/brand";
import { DemoTag } from "@/components/ui/tags";

export const metadata = { title: "All screens" };

const groups: { title: string; note: string; screens: [string, string][] }[] = [
  { title: "Entry", note: "Sign up, log in, consents", screens: [
    ["/signup", "Role fork"], ["/signup/support", "Sign up, support"], ["/signup/scholar", "Sign up, student"], ["/signup/clinician", "Sign up, psychologist"],
    ["/under-18", "Under 18"], ["/login", "Log in"], ["/login/verify", "Two-step code"], ["/onboarding/consents", "Consents"],
    ["/pending", "Pending verification"], ["/setup-2fa", "Two-step setup"],
  ] },
  { title: "Support (patient)", note: "Screens for the person seeking support", screens: [
    ["/home", "Home"], ["/home/new", "Home, first visit"], ["/intake/why", "Intake, why we ask"], ["/intake", "Intake question"], ["/intake/done", "Intake done"],
    ["/check-in", "Check-in picker"], ["/check-in/demo/setup", "Check-in setup"], ["/check-in/demo", "Check-in question"], ["/check-in/demo/safety", "Safety pathway"],
    ["/check-in/demo/voice/camera", "Spoken: camera guide"], ["/check-in/demo/voice/sound", "Spoken: sound check"], ["/check-in/demo/voice/interview", "Spoken: questions"], ["/check-in/demo/voice/done", "Spoken: done"], ["/check-in/demo/result", "Result"], ["/talk", "Talk"], ["/talk/demo", "Counselor chat"], ["/history", "History"], ["/sharing", "Sharing"], ["/settings", "Settings"], ["/help", "Crisis screen"],
  ] },
  { title: "Psychologist", note: "Dense screens for clinicians", screens: [
    ["/clinician/queue", "Queue"], ["/clinician/queue/empty", "Queue, empty"], ["/clinician/patients/ZS-7F3K-2Q", "Patient overview"],
    ["/clinician/flags/F-1042", "Flag trace"], ["/clinician/exports", "Exports"], ["/clinician/assistant", "Assistant"], ["/clinician/settings", "Settings"],
  ] },
  { title: "Student and researcher", note: "Tutor and simulator", screens: [
    ["/scholar", "Home"], ["/scholar/ask/demo", "Tutor"], ["/scholar/sources", "Sources"], ["/scholar/sim", "Case library"],
    ["/scholar/sim/demo/brief", "Brief"], ["/scholar/sim/demo", "Interview"], ["/scholar/sim/demo/debrief", "Debrief"], ["/scholar/profile", "Profile"],
  ] },
  { title: "Admin", note: "Verification, corpus, audit, safety", screens: [
    ["/admin/clinicians", "Clinician verification"], ["/admin/corpus", "Corpus"], ["/admin/audit", "Audit log"], ["/admin/safety", "Safety events"], ["/admin/health", "Health"],
  ] },
];

export default function Index() {
  return (
    <main className="mx-auto flex w-full max-w-[1040px] flex-col gap-12 px-6 py-14">
      <header className="flex flex-col gap-4">
        <Lockup className="h-8 w-auto self-start" />
        <h1 className="font-serif text-[44px] leading-tight">Every screen, one click apart</h1>
        <p className="max-w-[640px] text-lg text-ink-2">A non-operational prototype for review. Buttons move between screens; nothing is saved and no server is called. All people and numbers are synthetic.</p>
        <div><DemoTag /></div>
      </header>
      {groups.map((g) => (
        <section key={g.title} className="flex flex-col gap-4">
          <div className="flex items-baseline gap-4 border-b border-line pb-2"><h2 className="font-serif text-2xl">{g.title}</h2><p className="text-sm text-muted">{g.note}</p></div>
          <ul className="grid grid-cols-3 gap-x-6 gap-y-1">
            {g.screens.map(([href, label]) => (
              <li key={href}><Link href={href} className="flex items-baseline justify-between gap-3 rounded-md px-3 py-2 hover:bg-sunken">
                <span>{label}</span><span className="truncate font-mono text-[12px] text-muted">{href}</span>
              </Link></li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
