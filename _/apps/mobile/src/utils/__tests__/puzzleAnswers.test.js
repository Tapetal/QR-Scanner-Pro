import { isPuzzleAnswerCorrect } from "../puzzleAnswers";

describe("puzzle answer validation", () => {
  it("ignores capitalization, surrounding whitespace, and punctuation", () => {
    expect(isPuzzleAnswerCorrect("  A KEYBOARD! ", "A keyboard")).toBe(true);
  });

  it("does not accept a different answer", () => {
    expect(isPuzzleAnswerCorrect("A mouse", "A keyboard")).toBe(false);
  });
});
