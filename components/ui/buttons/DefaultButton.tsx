import { Colors, Typography } from "@/constants/design-system";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

interface CustomButtonProps extends Omit<PressableProps, "style"> {
  variant?: "primary" | "secondary" | "tertiary" | "icon";
  children: React.ReactNode;
  disabled?: boolean;
}

export const DefaultButton = ({
  variant = "primary",
  children,
  onPress,
  disabled = false,
  ...props
}: CustomButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "tertiary" && styles.tertiary,
        disabled && styles.disabled,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          variant === "primary" && styles.primaryText,
          variant === "secondary" && styles.secondaryText,
          variant === "tertiary" && styles.tertiaryText,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  primary: {
    backgroundColor: Colors.details,
  },
  secondary: {
    backgroundColor: "transparent",
    borderColor: Colors.details,
    borderWidth: 2,
  },
  tertiary: {
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: Colors.warning,
    borderRadius: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: Typography.fontSize.m,
    fontFamily: Typography.fontFamily.semibold,
    textAlign: "center",
  },
  primaryText: {
    color: Colors.light,
  },
  secondaryText: {
    color: Colors.details,
  },
  tertiaryText: {
    color: Colors.warning,
  },
});
