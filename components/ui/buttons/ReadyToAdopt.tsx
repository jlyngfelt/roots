import { IconSymbol } from "@/components/ui/icon-symbol";
import { ReadyToAdoptProps } from "../../../interfaces/index";

export const ReadyToAdopt = ({ readyToAdopt }: ReadyToAdoptProps) => {
  if (!readyToAdopt) return null;

  return <IconSymbol name="stroller.fill" size={26} color="#ff9730" />;
};
