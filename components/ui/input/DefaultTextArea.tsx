import { TextArea, TextAreaProps } from "tamagui";
import { useState } from 'react'

export const DefualtTextArea = (props: TextAreaProps) => {
    const [text, setText] = useState('')
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
