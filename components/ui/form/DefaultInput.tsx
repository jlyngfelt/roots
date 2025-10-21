import { Colors } from "@/constants/design-system";
import { useState } from "react";
import { Input, InputProps } from "tamagui";

export const DefaultInput = (props: InputProps) => {
  const [text, setText] = useState("");
  return (
    <Input
      borderWidth={1}
      borderColor={Colors.details}
      value={text}
      onChangeText={setText}
      paddingHorizontal={24}
      paddingVertical={8}
      backgroundColor={"transparent"}
      {...props}
    />
  );
};
