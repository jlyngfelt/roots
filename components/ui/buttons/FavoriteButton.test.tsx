import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import {
  addToFavorites,
  isPlantFavorited,
  removeFromFavorites,
} from "../../../services/favoritesService";
import { FavoriteButton } from "./FavouriteButton";

// Mock the favorites service
jest.mock("../../../services/favoritesService", () => ({
  isPlantFavorited: jest.fn(),
  addToFavorites: jest.fn(),
  removeFromFavorites: jest.fn(),
}));

const mockIsFavorited = isPlantFavorited as jest.Mock;
const mockAdd = addToFavorites as jest.Mock;
const mockRemove = removeFromFavorites as jest.Mock;

describe("FavoriteButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading initially", async () => {
    mockIsFavorited.mockResolvedValueOnce(false);
    const { getByTestId } = render(<FavoriteButton userId="1" plantId="10" />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("calls addToFavorites when not favorited and pressed", async () => {
    mockIsFavorited.mockResolvedValueOnce(false);
    mockAdd.mockResolvedValueOnce(undefined);

    const { getByTestId } = render(<FavoriteButton userId="1" plantId="10" />);

    const button = await waitFor(() => getByTestId("favorite-button"));
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith("1", "10");
    });
  });

  it("calls removeFromFavorites when favorited and pressed", async () => {
    mockIsFavorited.mockResolvedValueOnce(true);
    mockRemove.mockResolvedValueOnce(undefined);

    const { getByTestId } = render(<FavoriteButton userId="1" plantId="10" />);

    const button = await waitFor(() => getByTestId("favorite-button"));
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith("1", "10");
    });
  });
});
