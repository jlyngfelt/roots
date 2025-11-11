//Vårt designsystem - återanvändbara variabler att använda för styling i appen & komponenter
import { StyleSheet } from "react-native";

// || Color variables
export const Colors = {
  primary: "#99B566",
  secondary: "#E2E8D7",
  accent: "#f0597aff",
  details: "#93785fff",
  text: "#333333ff",
  light: "#FCFCF4",
  warning: "#d74518ff",
  grey: "#c7ccbcff",
  starkWhite: "#fff",
};

// || Typography
export const Typography = {
  fontFamily: {
    light: "Poppins_300Light",
    regular: "Poppins_400Regular",
    medium: "Poppins_500Medium",
    semibold: "Poppins_600SemiBold",
    bold: "Poppins_700Bold",
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
  m: 10,
  l: 12,
  xl: 16,
  full: 9999,
};

// ||Re-usable styles
export const Styles = StyleSheet.create({
  heading1: {
    fontFamily: "Poppins_700Bold",
    fontSize: Typography.fontSize["2xl"],
    color: Colors.text,
  },
  heading2: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: Typography.fontSize["xl"],
    color: Colors.text,
  },
  heading3: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: Typography.fontSize["l"],
    color: Colors.text,
  },
  heading4: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: Typography.fontSize["m"],
    color: Colors.text,
  },
  heading5: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: Typography.fontSize["s"],
    color: Colors.text,
  },
  bodyXL: {
    fontFamily: "Poppins_400Regular",
    fontSize: Typography.fontSize["xl"],
    color: Colors.text,
  },
  bodyL: {
    fontFamily: "Poppins_400Regular",
    fontSize: Typography.fontSize["l"],
    color: Colors.text,
  },
  bodyM: {
    fontFamily: "Poppins_400Regular",
    fontSize: Typography.fontSize["m"],
    color: Colors.text,
  },
  bodyS: {
    fontFamily: "Poppins_400Regular",
    fontSize: Typography.fontSize["s"],
    color: Colors.text,
  },
  bodyXS: {
    fontFamily: "Poppins_400Regular",
    fontSize: Typography.fontSize["xs"],
    color: Colors.text,
  },
  actionL: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: Typography.fontSize["m"],
    color: Colors.warning,
    marginVertical: Spacing.xs,
  },
  actionM: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: Typography.fontSize["s"],
    color: Colors.text,
  },
  actionS: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: Typography.fontSize["xs"],
    color: Colors.text,
  },
  caption: {
    fontFamily: "Poppins_400Regular",
    fontSize: Typography.fontSize.xs,
    color: Colors.text,
    textTransform: "uppercase",
    letterSpacing: Typography.fontSize["xs"] * 0.05,
  },
});
