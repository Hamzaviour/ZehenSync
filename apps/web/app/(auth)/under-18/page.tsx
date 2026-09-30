import { AuthPage } from "@/components/auth-page";
import { ButtonLink } from "@/components/ui/button";
import { crisisResources } from "@/lib/crisis/resources";

export const metadata = { title: "We can't set up an account yet" };

export default function Under18() {
  return (
    <AuthPage title="We can't set up an account for you yet" sub="ZehenSync is for adults. No account was created and we did not keep what you typed.">
      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-2xl">What can help now</h2>
        <ul className="list-disc space-y-2 pl-5 text-base text-ink-2">
          <li>Talk to a parent, a relative, a teacher or your school counsellor.</li>
          <li>If you are worried about your safety, call one of these free and confidential services.</li>
        </ul>
        <ul className="mt-2 flex flex-col divide-y divide-line rounded-lg border border-line">
          {crisisResources.map((r) => (
            <li key={r.name} className="flex items-center justify-between px-4 py-3">
              <span className="flex flex-col"><span className="font-medium">{r.name}</span><span className="text-sm text-muted">{r.detail}</span></span>
              <a href={`tel:${r.tel}`} className="font-mono text-lg text-accent underline underline-offset-4">{r.display}</a>
            </li>
          ))}
        </ul>
      </section>
      <ButtonLink href="/" variant="secondary" size="lg">Back to the start</ButtonLink>
    </AuthPage>
  );
}
