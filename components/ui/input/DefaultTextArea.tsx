import { useState } from "react";
import { TextArea, TextAreaProps } from "tamagui";

export const DefaultTextArea = (props: TextAreaProps) => {
  const [text, setText] = useState("");
  return (
    <TextArea
      size="$4"
      borderWidth={1}
      value={text}
      onChangeText={setText}
      {...props}
    />
  );
};
