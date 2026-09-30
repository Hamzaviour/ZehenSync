// Interface glyphs drawn to the brand grid (24 px, 1.75 stroke, square ends) for places the custom set has no icon.
type P = React.SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75,
  strokeLinecap: "square" as const, strokeLinejoin: "miter" as const, width: 20, height: 20, "aria-hidden": true };

export const IconHome = (p: P) => <svg {...base} {...p}><path d="M4 11 L12 4 L20 11" /><path d="M6 10 V20 H18 V10" /></svg>;
export const IconList = (p: P) => <svg {...base} {...p}><path d="M4 6 H20 M4 12 H20 M4 18 H20" /></svg>;
export const IconBook = (p: P) => <svg {...base} {...p}><path d="M4 5 H10 C11.1 5 12 5.9 12 7 V20 C12 19 11.1 18 10 18 H4 Z" /><path d="M20 5 H14 C12.9 5 12 5.9 12 7" /><path d="M20 5 V18 H14 C12.9 18 12 19 12 20" /></svg>;
export const IconSliders = (p: P) => <svg {...base} {...p}><path d="M4 7 H20 M4 17 H20" /><path d="M9 4 V10 M15 14 V20" /></svg>;
export const IconUsers = (p: P) => <svg {...base} {...p}><path d="M4 20 V17 C4 15.3 5.3 14 7 14 H11 C12.7 14 14 15.3 14 17 V20" /><path d="M9 10.5 A2.75 2.75 0 1 0 9 5 A2.75 2.75 0 0 0 9 10.5 Z" /><path d="M16 14.3 C18 14.5 20 15.5 20 17.5 V20" /></svg>;
export const IconDatabase = (p: P) => <svg {...base} {...p}><path d="M5 6 C5 4.6 8.1 3.5 12 3.5 C15.9 3.5 19 4.6 19 6 V18 C19 19.4 15.9 20.5 12 20.5 C8.1 20.5 5 19.4 5 18 Z" /><path d="M5 12 C5 13.4 8.1 14.5 12 14.5 C15.9 14.5 19 13.4 19 12" /></svg>;
export const IconPulse = (p: P) => <svg {...base} {...p}><path d="M3 12 H7 L9.5 6 L14 18 L16.5 12 H21" /></svg>;
export const IconCheck = (p: P) => <svg {...base} {...p}><path d="M5 12.5 L10 17.5 L19 7" /></svg>;
export const IconArrow = (p: P) => <svg {...base} {...p}><path d="M5 12 H19 M14 7 L19 12 L14 17" /></svg>;
export const IconChevron = (p: P) => <svg {...base} {...p}><path d="M9 6 L15 12 L9 18" /></svg>;
