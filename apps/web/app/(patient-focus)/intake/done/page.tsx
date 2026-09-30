import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Thanks" };

export default function IntakeDone() {
  return (
    <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col justify-center gap-8 px-6 py-16">
      <h1 className="font-serif text-[44px] leading-tight">Thanks. That is all for now.</h1>
      <div className="flex flex-col gap-4 text-lg text-ink-2">
        <p>Next, we suggest a 2-minute well-being check-in. It gives a starting point to compare later ones with.</p>
        <p>Your background answers stay private unless you choose to share them with a psychologist.</p>
      </div>
      <div className="flex gap-3">
        <ButtonLink href="/check-in/demo/setup" size="lg">Start check-in</ButtonLink>
        <ButtonLink href="/home" variant="secondary" size="lg">Go to home</ButtonLink>
      </div>
    </main>
  );
}
