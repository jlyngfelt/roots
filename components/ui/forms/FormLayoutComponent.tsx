import { Colors, Spacing } from "@/constants/design-system";
import { ReactNode } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface FormLayoutProps {
  children: ReactNode;
  centered?: boolean;
}

const { height } = Dimensions.get("window");

export const FormLayout = ({ children, centered = true }: FormLayoutProps) => {
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, centered && styles.centered]}
      enableOnAndroid={true}
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </KeyboardAwareScrollView>
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
