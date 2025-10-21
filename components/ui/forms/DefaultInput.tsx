import { Colors, Styles } from "@/constants/design-system";
import { Input, InputProps } from "tamagui";

export const DefaultInput = (props: InputProps) => {
  return (
    <Input
      borderWidth={1}
      marginVertical={4}
      borderColor={Colors.details}
      paddingHorizontal={24}
      paddingVertical={8}
      backgroundColor={"transparent"}
      width={"100%"}
      style={Styles.bodyM}
      placeholderTextColor={Colors.details}
      color={Colors.details}
      focusStyle={{
        borderColor: Colors.details,
        backgroundColor: "transparent",
      }}
      {...props}
    />
  );
};
