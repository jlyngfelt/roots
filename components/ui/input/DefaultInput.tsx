import { useState } from "react";
import { Input, InputProps } from "tamagui";

export const DefaultInput = (props: InputProps) => {
  const [text, setText] = useState("");
  return (
    <Input
      size="$4"
      borderWidth={1}
      value={text}
      onChangeText={setText}
      {...props}
    />
  );
};
