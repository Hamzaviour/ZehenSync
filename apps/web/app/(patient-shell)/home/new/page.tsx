import { PatientColumn } from "@/components/shell/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/alert";
import { PrototypeStates } from "@/components/prototype-states";

export const metadata = { title: "Home" };

export default function HomeNew() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col">
      <PatientColumn>
        <h1 className="font-serif text-[32px]">Hi, Sana.</h1>
        <EmptyState action={<ButtonLink href="/check-in/demo/setup" size="lg">Start check-in</ButtonLink>}>
          Start with a 2-minute well-being check-in.
        </EmptyState>
      </PatientColumn>
      <PrototypeStates current="/home/new" items={[{ href: "/home", label: "With history" }, { href: "/home/new", label: "First visit" }]} />
    </div>
  );
}
