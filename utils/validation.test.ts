import {
  isValidPostalCode,
  isValidEmail,
  truncateText,
  formatCredits,
} from "./validation";

describe("Validation Utils - Super Easy Tests", () => {
  describe("isValidPostalCode", () => {
    it("should return true for valid 5-digit postal code", () => {
      expect(isValidPostalCode("11120")).toBe(true);
      expect(isValidPostalCode("12345")).toBe(true);
    });

    it("should return false for invalid postal codes", () => {
      expect(isValidPostalCode("1234")).toBe(false); // too short
      expect(isValidPostalCode("123456")).toBe(false); // too long
      expect(isValidPostalCode("abcde")).toBe(false); // letters
      expect(isValidPostalCode("")).toBe(false); // empty
    });
  });

  describe("isValidEmail", () => {
    it("should return true for valid emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
    });

    it("should return false for invalid emails", () => {
      expect(isValidEmail("notanemail")).toBe(false);
      expect(isValidEmail("missing@domain")).toBe(false);
      expect(isValidEmail("@nodomain.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("truncateText", () => {
    it("should not truncate short text", () => {
      expect(truncateText("Hello", 10)).toBe("Hello");
    });

    it("should truncate long text and add ellipsis", () => {
      expect(truncateText("This is a very long text", 10)).toBe(
        "This is a ..."
      );
    });

    it("should return text as-is if exact length", () => {
      expect(truncateText("Hello", 5)).toBe("Hello");
    });
  });

  describe("formatCredits", () => {
    it("should format small numbers normally", () => {
      expect(formatCredits(0)).toBe("0");
      expect(formatCredits(100)).toBe("100");
      expect(formatCredits(999)).toBe("999");
    });

    it("should format thousands with k suffix", () => {
      expect(formatCredits(1000)).toBe("1.0k");
      expect(formatCredits(1500)).toBe("1.5k");
      expect(formatCredits(10000)).toBe("10.0k");
    });
  });
});
