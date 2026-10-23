jest.mock(
  "@react-native-async-storage/async-storage",
  () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import AsyncStorage from "@react-native-async-storage/async-storage";
import { chooseDailyPuzzle, getLocalDateKey } from "../dailyPuzzle";
import {
  canSolveToday,
  getDailyPuzzle,
  getSolvedPuzzles,
  markPuzzleSolved,
  setDailyPuzzleHintVisible,
} from "../puzzleStorage";

const puzzleBank = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  question: `Question ${index + 1}`,
}));

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("daily puzzle selection", () => {
  it("uses the device's local calendar date as the daily key", () => {
    const localDate = new Date(2026, 9, 23, 23, 59);
    expect(getLocalDateKey(localDate)).toBe("2026-10-23");
  });

  it("returns the same puzzle for a user and date, and varies by installation", () => {
    const first = chooseDailyPuzzle(puzzleBank, "user-a", "2026-10-23");
    const repeated = chooseDailyPuzzle(puzzleBank, "user-a", "2026-10-23");
    const secondUser = chooseDailyPuzzle(puzzleBank, "user-b", "2026-10-23");

    expect(repeated.id).toBe(first.id);
    expect(secondUser.id).not.toBe(first.id);
  });

  it("avoids recently assigned puzzles until the bank is exhausted", () => {
    const selected = chooseDailyPuzzle(
      puzzleBank,
      "user-a",
      "2026-10-23",
      [1, 2, 3],
    );
    expect([1, 2, 3]).not.toContain(selected.id);

    expect(() =>
      chooseDailyPuzzle([puzzleBank[0]], "user-a", "2026-10-23", [1]),
    ).not.toThrow();
  });

  it("persists the selection and hint progress for the day, then rolls over", async () => {
    const firstDay = new Date(2026, 9, 23, 8);
    const first = await getDailyPuzzle(puzzleBank, firstDay);
    await setDailyPuzzleHintVisible(first.dateKey, true);

    const reopened = await getDailyPuzzle(
      puzzleBank,
      new Date(2026, 9, 23, 22),
    );
    expect(reopened.puzzle.id).toBe(first.puzzle.id);
    expect(reopened.hintVisible).toBe(true);

    const nextDay = await getDailyPuzzle(
      puzzleBank,
      new Date(2026, 9, 24, 0, 1),
    );
    expect(nextDay.dateKey).toBe("2026-10-24");
    expect(nextDay.puzzle.id).not.toBe(first.puzzle.id);
  });

  it("records a solved puzzle only once per local day and preserves prior history", async () => {
    const first = await getDailyPuzzle(puzzleBank, new Date(2026, 9, 23, 10));
    const result = await markPuzzleSolved(
      first.puzzle,
      new Date(2026, 9, 23, 10),
    );
    const duplicate = await markPuzzleSolved(
      first.puzzle,
      new Date(2026, 9, 23, 11),
    );

    expect(result.solved).toHaveLength(1);
    expect(duplicate.alreadySolved).toBe(true);
    expect(await getSolvedPuzzles()).toHaveLength(1);
    expect(await canSolveToday(new Date(2026, 9, 23, 23))).toBe(false);

    const nextDay = await getDailyPuzzle(puzzleBank, new Date(2026, 9, 24, 10));
    await markPuzzleSolved(nextDay.puzzle, new Date(2026, 9, 24, 10));
    expect(await getSolvedPuzzles()).toHaveLength(2);
    expect(await canSolveToday(new Date(2026, 9, 24, 12))).toBe(false);
  });
});
