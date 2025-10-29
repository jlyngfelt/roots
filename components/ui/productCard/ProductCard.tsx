import { ProductCardProps } from "../../../interfaces/index";
import { ProductCardBig } from "./ProductCardBig";
import { ProductCardSmall } from "./ProductCardSmall";
import { ProductCardView } from "./ProductCardView";

export const ProductCard = (props: ProductCardProps) => {
  const { variant = "big" } = props;

  switch (variant) {
    case "small":
      return <ProductCardSmall {...props} />;
    case "view":
      return <ProductCardView {...props} />;
    case "big":
    default:
      return <ProductCardBig {...props} />;
  }
};
