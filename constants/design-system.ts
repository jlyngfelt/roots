//Vårt designsystem - återanvändbara variabler att använda för styling i appen & komponenter
import { StyleSheet } from "react-native";

// || Color variables
export const Colors = {
  light: {
    primary: {
      main: "#4A90E2",
      light: "#6FA8E8",
      dark: "#357ABD",
    },
    secondary: {
      main: "#50C878",
      light: "#7DD89C",
      dark: "#3DA55F",
    },
    text: {
      primary: "#11181C",
      secondary: "#687076",
      disabled: "#9BA1A6",
      inverse: "#FFFFFF",
    },
    background: {
      primary: "#FFFFFF",
      secondary: "#F5F5F5",
      tertiary: "#E6F4FE",
    },
    tint: "#0a7ea4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",
  },
  dark: {
    primary: {
      main: "#6FA8E8",
      light: "#8BBBEF",
      dark: "#4A90E2",
    },
    secondary: {
      main: "#7DD89C",
      light: "#99E1B3",
      dark: "#50C878",
    },
    text: {
      primary: "#ECEDEE",
      secondary: "#9BA1A6",
      disabled: "#687076",
      inverse: "#11181C",
    },
    background: {
      primary: "#151718",
      secondary: "#1E2022",
      tertiary: "#2A2D30",
    },
    tint: "#FFFFFF",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#FFFFFF",
  },
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
    color: Colors.light.text.primary,
  },
  heading2: {
    fontSize: Typography.fontSize["xl"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.text.primary,
  },
  heading3: {
    fontSize: Typography.fontSize["l"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.text.primary,
  },
  heading4: {
    fontSize: Typography.fontSize["m"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.text.primary,
  },
  heading5: {
    fontSize: Typography.fontSize["s"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.text.primary,
  },
  bodyXL: {
    fontSize: Typography.fontSize["xl"],
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text.primary,
  },
  bodyL: {
    fontSize: Typography.fontSize["l"],
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text.primary,
  },
  bodyM: {
    fontSize: Typography.fontSize["m"],
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text.primary,
  },
  bodyS: {
    fontSize: Typography.fontSize["s"],
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text.primary,
  },
  bodyXS: {
    fontSize: Typography.fontSize["xs"],
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text.primary,
  },
  actionL: {
    fontSize: Typography.fontSize["m"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.text.primary,
  },
  actionM: {
    fontSize: Typography.fontSize["s"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.text.primary,
  },
  actionS: {
    fontSize: Typography.fontSize["xs"],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.text.primary,
  },

  caption: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text.secondary,
    textTransform: "uppercase",
    letterSpacing: Typography.fontSize["xs"] * 0.05,
  },
});
