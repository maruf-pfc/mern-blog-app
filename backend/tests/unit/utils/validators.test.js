const { isValidTitle } = require("../../../src/utils/validators");

describe("Utility: validators", () => {
  describe("isValidTitle", () => {
    it("should return true for a valid title", () => {
      expect(isValidTitle("A Good Title")).toBe(true);
    });

    it("should return false for an empty title", () => {
      expect(isValidTitle("")).toBe(false);
      expect(isValidTitle("   ")).toBe(false);
    });

    it("should return false for a title that is too long", () => {
      const longTitle = "a".repeat(101);
      expect(isValidTitle(longTitle)).toBe(false);
    });

    it("should return false for non-string input", () => {
      expect(isValidTitle(123)).toBe(false);
      expect(isValidTitle(null)).toBe(false);
      expect(isValidTitle(undefined)).toBe(false);
    });
  });
});
