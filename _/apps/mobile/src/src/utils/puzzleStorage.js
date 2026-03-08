import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_KEY = "puzzle_streak";
const LAST_SOLVED_KEY = "puzzle_last_solved";
const SOLVED_PUZZLES_KEY = "puzzle_solved";
const CURRENT_INDEX_KEY = "puzzle_current_index";

export const getStreak = async () => {
  try {
    const streak = await AsyncStorage.getItem(STREAK_KEY);
    return streak ? parseInt(streak, 10) : 0;
  } catch (e) {
    console.error("Error reading streak", e);
    return 0;
  }
};

export const getLastSolved = async () => {
  try {
    const lastSolved = await AsyncStorage.getItem(LAST_SOLVED_KEY);
    return lastSolved ? new Date(lastSolved) : null;
  } catch (e) {
    console.error("Error reading last solved date", e);
    return null;
  }
};

export const getSolvedPuzzles = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SOLVED_PUZZLES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading solved puzzles", e);
    return [];
  }
};

export const getCurrentPuzzleIndex = async () => {
  try {
    const index = await AsyncStorage.getItem(CURRENT_INDEX_KEY);
    return index ? parseInt(index, 10) : 0;
  } catch (e) {
    console.error("Error reading current index", e);
    return 0;
  }
};

export const markPuzzleSolved = async (puzzle) => {
  try {
    const now = new Date();
    const lastSolved = await getLastSolved();
    let streak = await getStreak();

    // Check if this is a new day
    const isNewDay = !lastSolved || !isSameDay(lastSolved, now);

    if (isNewDay) {
      // Check if it's consecutive days
      if (lastSolved && isYesterday(lastSolved, now)) {
        streak += 1;
      } else if (lastSolved) {
        // Streak broken
        streak = 1;
      } else {
        // First puzzle ever
        streak = 1;
      }

      await AsyncStorage.setItem(STREAK_KEY, streak.toString());
      await AsyncStorage.setItem(LAST_SOLVED_KEY, now.toISOString());
    }

    // Add to solved puzzles
    const solved = await getSolvedPuzzles();
    const solvedEntry = {
      ...puzzle,
      solvedAt: now.toISOString(),
      streak: streak,
    };

    const newSolved = [solvedEntry, ...solved];
    await AsyncStorage.setItem(SOLVED_PUZZLES_KEY, JSON.stringify(newSolved));

    return { streak, solved: newSolved };
  } catch (e) {
    console.error("Error marking puzzle solved", e);
    return { streak: 0, solved: [] };
  }
};

export const incrementPuzzleIndex = async () => {
  try {
    const current = await getCurrentPuzzleIndex();
    const next = current + 1;
    await AsyncStorage.setItem(CURRENT_INDEX_KEY, next.toString());
    return next;
  } catch (e) {
    console.error("Error incrementing index", e);
    return 0;
  }
};

const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isYesterday = (date1, date2) => {
  const yesterday = new Date(date2);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date1, yesterday);
};

export const canSolveToday = async () => {
  const lastSolved = await getLastSolved();
  if (!lastSolved) return true;

  const now = new Date();
  return !isSameDay(lastSolved, now);
};
