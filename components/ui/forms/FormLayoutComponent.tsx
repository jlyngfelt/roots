import { Colors, Spacing } from "@/constants/design-system";
import { ReactNode } from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

interface FormLayoutProps {
  children: ReactNode;
  centered?: boolean;
}

const { height } = Dimensions.get("window");

export const FormLayout = ({ children, centered = true }: FormLayoutProps) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, centered && styles.centered]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  content: {
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.xl,
    gap: Spacing.m,
  },
  centered: {
    minHeight: height,
    justifyContent: "center",
    alignItems: "center",
  },
});
