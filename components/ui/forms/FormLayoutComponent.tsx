import { Colors, Spacing } from "@/constants/design-system";
import { ReactNode } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface FormLayoutProps {
  children: ReactNode;
}

const { height } = Dimensions.get("window");

export const FormLayout = ({ children }: FormLayoutProps) => {
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
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
    minHeight: height,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    gap: Spacing.m,
  },
});
