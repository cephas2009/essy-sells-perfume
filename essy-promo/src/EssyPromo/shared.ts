import { loadFont } from "@remotion/google-fonts/Poppins";
import { loadFont as loadSerifFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const serif = loadSerifFont("italic", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

export const FONT_FAMILY = fontFamily;
export const FONT_FAMILY_SERIF = serif.fontFamily;

// Bold magenta + white brand palette
export const COLORS = {
  magenta: "#FF0080",
  magentaDark: "#D10069",
  magentaLight: "#FF5CAD",
  pinkTint: "#FFE4F0",
  pinkSoft: "#FFF0F7",
  lavender: "#E9E4FF",
  dark: "#2A0A20",
  muted: "#8A6680",
  white: "#FFFFFF",
  whatsapp: "#25D366",
  whatsappDark: "#128C7E",
} as const;

export const GRADIENT = `linear-gradient(90deg, ${COLORS.magenta}, ${COLORS.magentaLight}, ${COLORS.magenta})`;
