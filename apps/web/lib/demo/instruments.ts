export const phq9Bands = ["minimal", "mild", "moderate", "moderately severe", "severe"] as const;
export const phq9Range = [[0, 4], [5, 9], [10, 14], [15, 19], [20, 27]] as const;

export const answerOptions = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

/** Session shown on the runner and result screens. Item 4 of 9, PHQ-9. */
export const runnerItem = {
  n: 4, of: 9, timeframe: "Over the last 2 weeks",
  displayed: "How often have you felt low or hopeless?",
  canonical: "Feeling down, depressed, or hopeless",
};

export const result = { score: 12, max: 27, bandIndex: 2, headline: "Your answers suggest a noticeable level of low mood.", body: "Talking to a counsellor or psychologist could help." };

export const cssrsQ1 = "Have you wished you were dead or wished you could go to sleep and not wake up?";

export const intakeQuestion = {
  n: 3, of: 7, title: "Money worries",
  question: "In the last month, how often has money been a worry?",
  options: ["Almost never", "Sometimes", "Often", "Most days", "Prefer not to say"],
};
