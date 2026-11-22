import {
  IconCheckIn, IconCounselor, IconHistory, IconShare, IconFlag, IconTrace, IconCitation, IconConsent,
} from "@/components/icons";
import {
  IconBook, IconDatabase, IconHome, IconList, IconPulse, IconSliders, IconUsers,
} from "@/components/icons-extra";

export type Role = "patient" | "clinician" | "scholar" | "admin";

export type NavItem = {
  href: string; label: string; icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  /** Path prefixes that keep this item highlighted. Defaults to `href`. */
  match?: string[];
  /** Highlight only on the exact path, for section roots. */
  exact?: boolean;
};

export const roleLabel: Record<Role, string> = {
  patient: "", clinician: "Psychologist", scholar: "Student and researcher", admin: "Admin",
};

export const account: Record<Role, { name: string; note: string }> = {
  patient: { name: "Sana", note: "Signed in" },
  clinician: { name: "Dr. A. Khan", note: "Verified psychologist" },
  scholar: { name: "Bilal R.", note: "MS Clinical Psychology" },
  admin: { name: "Admin", note: "Two-step on" },
};

export const nav: Record<Role, NavItem[]> = {
  patient: [
    { href: "/home", label: "Home", icon: IconHome },
    { href: "/check-in", label: "Check in", icon: IconCheckIn },
    { href: "/talk", label: "Talk", icon: IconCounselor },
    { href: "/history", label: "My history", icon: IconHistory },
    { href: "/sharing", label: "Sharing", icon: IconShare },
    { href: "/settings", label: "Settings", icon: IconSliders },
  ],
  clinician: [
    { href: "/clinician/queue", label: "Queue", icon: IconList, match: ["/clinician/queue", "/clinician/patients"] },
    { href: "/clinician/flags/F-1042", label: "Flag trace", icon: IconFlag, match: ["/clinician/flags"] },
    { href: "/clinician/exports", label: "Exports", icon: IconShare },
    { href: "/clinician/assistant", label: "Assistant", icon: IconCitation },
    { href: "/clinician/settings", label: "Settings", icon: IconSliders },
  ],
  scholar: [
    { href: "/scholar", label: "Home", icon: IconHome, exact: true },
    { href: "/scholar/ask/demo", label: "Tutor", icon: IconCounselor, match: ["/scholar/ask"] },
    { href: "/scholar/sources", label: "Sources", icon: IconBook },
    { href: "/scholar/sim", label: "Simulator", icon: IconTrace },
    { href: "/scholar/profile", label: "Profile", icon: IconConsent },
  ],
  admin: [
    { href: "/admin/clinicians", label: "Clinicians", icon: IconUsers },
    { href: "/admin/corpus", label: "Corpus", icon: IconDatabase },
    { href: "/admin/audit", label: "Audit", icon: IconList },
    { href: "/admin/safety", label: "Safety", icon: IconFlag },
    { href: "/admin/health", label: "Health", icon: IconPulse },
  ],
};
