//Vårt designsystem - återanvändbara variabler att använda för styling i appen & komponenter
import { StyleSheet } from "react-native";

// || Color variables
export const Colors = {
  primary: "#1b9844ff",
  secondary: "#929292",
  accent: "#f119b1ff",
  text: "#1A1A1A",
  background: "#FFFFFF",
};

// || Typography
export const Typography = {
  fontFamily: {
    sans: "system-ui",
    mono: "monospace",
  },
  fontSize: {
    xs: 10,
    s: 12,
    m: 14,
    l: 16,
    xl: 18,
    "2xl": 24,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// || Other
export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 56,
};

export const BorderRadius = {
  none: 0,
  s: 4,
  m: 8,
  l: 12,
  xl: 16,
  full: 9999,
};

// ||Re-usable styles
export const Styles = StyleSheet.create({
  // Typography styles
  heading1: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  heading2: {
    fontSize: Typography.fontSize["xl"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  heading3: {
    fontSize: Typography.fontSize["l"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  heading4: {
    fontSize: Typography.fontSize["m"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  heading5: {
    fontSize: Typography.fontSize["s"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  bodyXL: {
    fontSize: Typography.fontSize["xl"],
    fontWeight: Typography.fontWeight.regular,
    color: Colors.text,
  },
  bodyL: {
    fontSize: Typography.fontSize["l"],
    fontWeight: Typography.fontWeight.regular,
    color: Colors.text,
  },
  bodyM: {
    fontSize: Typography.fontSize["m"],
    fontWeight: Typography.fontWeight.regular,
    color: Colors.text,
  },
  bodyS: {
    fontSize: Typography.fontSize["s"],
    fontWeight: Typography.fontWeight.regular,
    color: Colors.text,
  },
  bodyXS: {
    fontSize: Typography.fontSize["xs"],
    fontWeight: Typography.fontWeight.regular,
    color: Colors.text,
  },
  actionL: {
    fontSize: Typography.fontSize["m"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  actionM: {
    fontSize: Typography.fontSize["s"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  actionS: {
    fontSize: Typography.fontSize["xs"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },

  caption: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.text,
    textTransform: "uppercase",
    letterSpacing: Typography.fontSize["xs"] * 0.05,
  },
});
