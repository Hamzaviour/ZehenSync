// Synthetic demo data only (Rules › Clinical safety 10). No real people, no real scores.
export const patient = { name: "Sana", pseudonym: "ZS-7F3K-2Q" };

export const queue = [
  { pid: "ZS-7F3K-2Q", name: "Sana A.", level: "urgent" as const, instrument: "PHQ-9", score: 12, delta: 7.7, flags: 2, last: "Today, 14:05", linked: "3 Nov 2026" },
  { pid: "ZS-2M9C-8D", name: "Hira M.", level: "crisis" as const, instrument: "C-SSRS", score: 0, delta: 0, flags: 1, last: "Today, 09:41", linked: "19 Oct 2026", note: "Safety pathway ran" },
  { pid: "ZS-5T1H-4B", name: "ZS-5T1H-4B", level: "watch" as const, instrument: "GAD-7", score: 11, delta: 4.3, flags: 1, last: "Yesterday, 21:12", linked: "27 Oct 2026" },
  { pid: "ZS-8K4P-1X", name: "Usman T.", level: "watch" as const, instrument: "WHO-5", score: 36, delta: -12, flags: 1, last: "18 Nov 2026", linked: "8 Nov 2026" },
  { pid: "ZS-3R6W-9L", name: "ZS-3R6W-9L", level: "info" as const, instrument: "PHQ-9", score: 6, delta: 0.7, flags: 0, last: "17 Nov 2026", linked: "12 Oct 2026" },
  { pid: "ZS-9D2N-5Q", name: "Ayesha K.", level: "info" as const, instrument: "GAD-7", score: 4, delta: -1.3, flags: 0, last: "14 Nov 2026", linked: "2 Oct 2026" },
];

export const pendingClinicians = [
  { name: "Dr. Nadia Farooq", licence: "PAC-LHR-20418", institution: "Fountain House Clinic, Lahore", sent: "29 Nov 2026", proof: "licence-scan.pdf", size: "1.2 MB" },
  { name: "Dr. Imran Sheikh", licence: "PAC-ISB-11907", institution: "NUST Counselling Centre", sent: "28 Nov 2026", proof: "licence.pdf", size: "0.8 MB" },
  { name: "Dr. Maryam Baig", licence: "PAC-KHI-30215", institution: "Aga Khan University Hospital", sent: "26 Nov 2026", proof: "pac-certificate.pdf", size: "2.1 MB" },
];
