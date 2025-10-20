import { Colors, Typography } from "@/constants/design-system";
import { Button, ButtonProps } from "tamagui";

interface CustomButtonProps extends Omit<ButtonProps, "variant"> {
  // detta exkluderar variant då jag inte fick använda det annars
  variant?: "primary" | "secondary" | "tertiary" | "icon" ;
}

export const DefaultButton = ({
  variant = "primary",
  children,
  onPress,
  disabled = false,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      backgroundColor={
        variant === "primary"
          ? Colors.details
          : variant === "secondary"
          ? "transparent"
          : "transparent"
      }
      color={
        variant === "tertiary"
          ? Colors.warning
          : variant === "secondary"
          ? Colors.details
          : Colors.light
      }
      alignSelf="center"
      paddingVertical={variant === "tertiary" ? 0 : 8}
      paddingHorizontal={variant === "tertiary" ? 0 : 24}
      borderColor={variant === "secondary" ? Colors.details : undefined}
      borderWidth={variant === "secondary" ? 2 : 1}
      borderBottomWidth={variant === "tertiary" ? 2 : 0}
      borderRadius={variant === "tertiary" ? 0 : undefined}
      borderBottomColor={variant === "tertiary" ? Colors.warning : undefined}
      fontSize={Typography.fontSize["m"]}
      fontWeight={Typography.fontWeight.semibold}
      {...props}
    >
      {children}
    </Button>
  );
};
