import { Input, InputProps } from "tamagui";
import { useState } from 'react'

export const DefualtInput = (props: InputProps) => {
    const [text, setText] = useState('')
  return (
    <Input
      size="$4"
      borderWidth={2}
      value={text}
      onChangeText={setText}
      {...props}
    />
  );
};
