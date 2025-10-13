import { Switch, SwitchProps } from "tamagui";

export const DefaultSwitch = (props: SwitchProps) => { 
  return (
    
    <Switch size="$4" defaultChecked={false} {...props}  backgroundColor="$green10"  > 
      <Switch.Thumb animation="bouncy" backgroundColor="white"/>
    </Switch>
  );
};