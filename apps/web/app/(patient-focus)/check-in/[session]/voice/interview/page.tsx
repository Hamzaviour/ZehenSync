import { PrototypeStates } from "@/components/prototype-states";
import { voiceStates } from "@/components/patient/runner-states";
import { Interview } from "@/components/voice/interview";

export const metadata = { title: "Spoken check-in" };
export const dynamicParams = false;
export function generateStaticParams() { return [{ session: "demo" }]; }

export default function InterviewPage() {
  return (
    <>
      <Interview done="/check-in/demo/voice/done" />
      <PrototypeStates current="/check-in/demo/voice/interview" items={voiceStates} />
    </>
  );
}
