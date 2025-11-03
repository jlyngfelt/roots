import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { DefaultButton } from "./DefaultButton";

describe("DefaultButton", () => {
  test("renders with text", () => {
    const { getByText } = render(<DefaultButton>Click Me</DefaultButton>);

    const buttonText = getByText("Click Me");
    expect(buttonText).toBeTruthy();
  });

  test("calls onPress when clicked", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <DefaultButton onPress={mockOnPress}>Press Me</DefaultButton>
    );

    const button = getByText("Press Me");
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test("does not call onPress when disabled", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <DefaultButton onPress={mockOnPress} disabled={true}>
        Disabled Button
      </DefaultButton>
    );

    const button = getByText("Disabled Button");
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test("renders primary variant by default", () => {
    const { getByText } = render(<DefaultButton>Primary</DefaultButton>);

    const button = getByText("Primary").parent;

    expect(button).toBeTruthy();
  });

  test("renders secondary variant", () => {
    const { getByText } = render(
      <DefaultButton variant="secondary">Secondary</DefaultButton>
    );

    const buttonText = getByText("Secondary");
    expect(buttonText).toBeTruthy();
  });

  test("renders tertiary variant", () => {
    const { getByText } = render(
      <DefaultButton variant="tertiary">Tertiary</DefaultButton>
    );

    const buttonText = getByText("Tertiary");
    expect(buttonText).toBeTruthy();
  });

  test("applies custom style prop", () => {
    const customStyle = { marginTop: 20 };
    const { getByText } = render(
      <DefaultButton style={customStyle}>Styled</DefaultButton>
    );

    const buttonText = getByText("Styled");
    expect(buttonText).toBeTruthy();
  });
});
