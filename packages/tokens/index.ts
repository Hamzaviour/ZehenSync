export const tokens = {
  paper: "#FFFFFF", mist: "#F4F5F8", line: "#E3E5EC", slate: "#C5C9D6",
  graphite500: "#62677D", graphite700: "#454A60", ink: "#0E1233",
  neel50: "#F1F2FB", neel100: "#E3E6F7", neel300: "#9AA6F2", neel600: "#3441A8", neel700: "#26318A",
  saffron400: "#E3A33B", saffron700: "#8A5A0E", night: "#0B0E24", nightRaised: "#151A3A",
} as const;
export type TokenName = keyof typeof tokens;
