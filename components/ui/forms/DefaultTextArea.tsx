import { Colors, Styles } from "@/constants/design-system";
import { TextArea, TextAreaProps } from "tamagui";

export const DefaultTextArea = (props: TextAreaProps) => {
  return (
    <TextArea
      borderWidth={1}
      marginVertical={4}
      borderColor={Colors.details}
      paddingHorizontal={24}
      paddingVertical={8}
      backgroundColor={"transparent"}
      width={"100%"}
      minHeight={100}
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
