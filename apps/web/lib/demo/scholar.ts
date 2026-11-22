import type { Reference } from "@/components/citations";

// Demo excerpts for layout review only. Not a quotation of any published source.
export const refs: Reference[] = [
  { n: 1, title: "DSM-5-TR, Depressive Disorders", where: "p. 183", tier: "Tier 1 · corpus · score 0.91",
    quote: "Major depressive episodes require five or more symptoms during the same two-week period. The symptoms must represent a change from previous functioning.",
    cited: "five or more symptoms during the same two-week period" },
  { n: 2, title: "DSM-5-TR, Persistent Depressive Disorder", where: "p. 194", tier: "Tier 1 · corpus · score 0.88",
    quote: "Depressed mood for most of the day, for more days than not, for at least two years in adults.",
    cited: "for at least two years in adults" },
];

export const cases = [
  { id: "demo", title: "A teacher who is always tired", setting: "Community clinic", level: "Intro", mins: 20 },
  { id: "demo", title: "A student who stopped attending class", setting: "University counselling centre", level: "Intermediate", mins: 20 },
  { id: "demo", title: "A father who cannot stop worrying", setting: "Outpatient clinic", level: "Intermediate", mins: 20 },
  { id: "demo", title: "A nurse after a night-shift incident", setting: "Hospital liaison", level: "Advanced", mins: 20 },
  { id: "demo", title: "A young woman who avoids leaving home", setting: "Community clinic", level: "Advanced", mins: 20 },
];

export const rubric = [
  { area: "Rapport and opening", score: 4, note: "You introduced yourself and explained the purpose.", cite: "Interview guide, ch. 2" },
  { area: "Presenting problem", score: 4, note: "You asked for onset and course in the client's words.", cite: "Interview guide, ch. 3" },
  { area: "Risk assessment", score: 2, note: "You did not ask directly about suicidal thoughts.", cite: "DSM-5-TR, p. 183" },
  { area: "History and context", score: 3, note: "Work and family covered. Sleep and substance use were not.", cite: "Interview guide, ch. 4" },
  { area: "Closing", score: 5, note: "You summarised and agreed a next step.", cite: "Interview guide, ch. 6" },
];
