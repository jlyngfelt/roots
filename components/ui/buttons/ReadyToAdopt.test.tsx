import { render } from "@testing-library/react-native";
import React from "react";
import { ReadyToAdopt } from "./ReadyToAdopt";

jest.mock("@/components/ui/icon-symbol", () => {
  const { Text } = require("react-native");
  return {
    IconSymbol: ({ name, testID }: { name: string; testID?: string }) => (
      <Text testID={testID}>{name}</Text>
    ),
  };
});

describe("ReadyToAdopt", () => {
  it("renders nothing when readyToAdopt is false", () => {
    const { toJSON } = render(<ReadyToAdopt readyToAdopt={false} />);
    expect(toJSON()).toBeNull();
  });

  it("renders IconSymbol when readyToAdopt is true", () => {
    const { getByText } = render(<ReadyToAdopt readyToAdopt={true} />);
    expect(getByText("stroller.fill")).toBeTruthy();
  });
});
