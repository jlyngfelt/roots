import { Image } from "react-native";

const readyToAdoptIcon = require("../../../assets/icons/readyToAdopt.png");

interface ReadyToAdoptProps {
  readyToAdopt: boolean;
}

export const ReadyToAdopt = ({ readyToAdopt }: ReadyToAdoptProps) => {
  if (!readyToAdopt) return null;
  return <Image source={readyToAdoptIcon} style={{ width: 24, height: 24 }} />;
};
