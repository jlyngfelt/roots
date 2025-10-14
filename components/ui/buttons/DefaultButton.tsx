import { Button, ButtonProps } from "tamagui";

interface CustomButtonProps extends Omit<ButtonProps, "variant"> {
  // detta exkluderar variant då jag inte fick använda det annars
  variant?: "primary" | "secondary" | "tertiary" | "icon" | "list";
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
          ? "$blue10"
          : variant === "secondary"
            ? "$green5"
            : "transparent"
      }
      color={
        variant === "tertiary"
          ? "$red10"
          : variant === "secondary"
            ? "$gray12"
            : "white"
      }
      alignSelf="center" // lägger knappar i mitten men gör också att de håller rätt storlek?
      paddingVertical={variant === "tertiary" ? 0 : 8}
      paddingHorizontal={variant === "tertiary" ? 0 : 24}
      borderBottomWidth={variant === "tertiary" ? 1 : 0}
      borderRadius={variant === "tertiary" ? 0 : undefined}
      borderBottomColor={variant === "tertiary" ? "$red10" : undefined}
      hoverStyle={{
        backgroundColor: variant === "primary" ? "$blue11" : "$gray6",
      }}
      pressStyle={{
        backgroundColor: variant === "primary" ? "$blue9" : "$gray4",
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
