import { Image } from "react-native";
import { ReadyToAdoptProps} from "../../../interfaces/index"

const readyToAdoptIcon = require("../../../assets/icons/readyToAdopt.png");

export const ReadyToAdopt = ({ readyToAdopt }: ReadyToAdoptProps) => {
  if (!readyToAdopt) return null;
  return <Image source={readyToAdoptIcon} style={{ width: 24, height: 24 }} />;
};
