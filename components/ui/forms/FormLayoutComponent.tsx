import { Colors, Spacing } from "@/constants/design-system";
import { ReactNode } from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

interface FormLayoutProps {
  children: ReactNode;
}

const { height } = Dimensions.get("window");

export const FormLayout = ({ children }: FormLayoutProps) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
    minHeight: height,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.m,
    gap: Spacing.m,
  },
});
