import { Switch, SwitchProps } from "tamagui";
import { Colors } from "../../../constants/design-system"

export const DefaultSwitch = (props: SwitchProps) => {
  return (
    <Switch
      size="$4"
      width={80}
      defaultChecked={false}
      {...props}
      backgroundColor={props.checked ? Colors.accent : Colors.grey}
    >
      <Switch.Thumb animation="bouncy" backgroundColor="white" />
    </Switch>
  );
};
