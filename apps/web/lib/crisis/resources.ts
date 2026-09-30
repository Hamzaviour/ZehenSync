// Hardcoded on purpose (Safety-Protocol §3). Changing a number means changing the protocol page and
// tests/unit/crisis-resources.test.ts in the same pull request. Call each number before every release (T-3.11).
export type CrisisResource = { name: string; detail: string; display: string; tel: string };

export const crisisResources: CrisisResource[] = [
  { name: "Umang Pakistan", detail: "Mental health helpline, 24/7", display: "0311 7786264", tel: "03117786264" },
  { name: "Rozan Counseling Helpline", detail: "Counselling by phone", display: "0304 111 1741", tel: "03041111741" },
  { name: "Rescue 1122", detail: "Emergency", display: "1122", tel: "1122" },
  { name: "Edhi ambulance", detail: "Ambulance", display: "115", tel: "115" },
];
