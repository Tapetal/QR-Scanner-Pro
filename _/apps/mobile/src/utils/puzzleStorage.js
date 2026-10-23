import AsyncStorage from "@react-native-async-storage/async-storage";
import { chooseDailyPuzzle, getLocalDateKey } from "./dailyPuzzle";

const STREAK_KEY = "puzzle_streak";
const LAST_SOLVED_KEY = "puzzle_last_solved";
const SOLVED_PUZZLES_KEY = "puzzle_solved";
const INSTALLATION_ID_KEY = "puzzle_installation_id";
const DAILY_ASSIGNMENTS_KEY = "puzzle_daily_assignments";
const DAILY_STATE_KEY = "puzzle_daily_state";
let installationIdPromise;
let puzzleSolvePromise;

const readJson = async (key, fallback) => {
  const stored = await AsyncStorage.getItem(key);
  return stored === null ? fallback : JSON.parse(stored);
};

const createInstallationId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}`;

const getInstallationId = () => {
  if (!installationIdPromise) {
    installationIdPromise = (async () => {
      let installationId = await AsyncStorage.getItem(INSTALLATION_ID_KEY);
      if (!installationId) {
        installationId = createInstallationId();
        await AsyncStorage.setItem(INSTALLATION_ID_KEY, installationId);
      }
      return installationId;
    })().catch((error) => {
      installationIdPromise = null;
      throw error;
    });
  }
  return installationIdPromise;
};

export const getStreak = async () => {
  const streak = await AsyncStorage.getItem(STREAK_KEY);
  const value = streak === null ? 0 : Number.parseInt(streak, 10);
  return Number.isFinite(value) ? value : 0;
};

export const getLastSolved = async () => {
  const lastSolved = await AsyncStorage.getItem(LAST_SOLVED_KEY);
  return lastSolved ? new Date(lastSolved) : null;
};

export const getSolvedPuzzles = async () =>
  readJson(SOLVED_PUZZLES_KEY, []);

export const getDailyPuzzle = async (puzzleBank, now = new Date()) => {
  if (!puzzleBank.length) {
    throw new Error("The puzzle bank is empty; a daily puzzle cannot be selected.");
  }

  const dateKey = getLocalDateKey(now);
  const assignments = await readJson(DAILY_ASSIGNMENTS_KEY, []);
  const assignment = assignments.find((item) => item.dateKey === dateKey);
  const installationId = await getInstallationId();

  let puzzleId = assignment?.puzzleId;
  let nextAssignments = assignments;

  if (!puzzleBank.some((puzzle) => String(puzzle.id) === String(puzzleId))) {
    const recentPuzzleIds = assignments
      .slice(-7)
      .map((item) => item.puzzleId);
    const puzzle = chooseDailyPuzzle(
      puzzleBank,
      installationId,
      dateKey,
      recentPuzzleIds,
    );
    puzzleId = puzzle.id;
    nextAssignments = [
      ...assignments.filter((item) => item.dateKey !== dateKey),
      { dateKey, puzzleId },
    ].slice(-90);
    await AsyncStorage.setItem(
      DAILY_ASSIGNMENTS_KEY,
      JSON.stringify(nextAssignments),
    );
  }

  let state = await readJson(DAILY_STATE_KEY, null);
  if (!state || state.dateKey !== dateKey || String(state.puzzleId) !== String(puzzleId)) {
    state = { dateKey, puzzleId, hintVisible: false, completed: false };
    await AsyncStorage.setItem(DAILY_STATE_KEY, JSON.stringify(state));
  }

  return {
    puzzle: puzzleBank.find(
      (item) => String(item.id) === String(puzzleId),
    ),
    dateKey,
    hintVisible: Boolean(state.hintVisible),
    completed: Boolean(state.completed),
  };
};

export const setDailyPuzzleHintVisible = async (dateKey, hintVisible) => {
  const state = await readJson(DAILY_STATE_KEY, null);
  if (!state || state.dateKey !== dateKey) return;
  await AsyncStorage.setItem(
    DAILY_STATE_KEY,
    JSON.stringify({ ...state, hintVisible }),
  );
};

const saveSolvedPuzzle = async (puzzle, now) => {
  const dateKey = getLocalDateKey(now);
  const solved = await getSolvedPuzzles();
  const alreadySolved = solved.find(
    (item) =>
      item.dailyDateKey === dateKey ||
      (!item.dailyDateKey &&
        item.solvedAt &&
        getLocalDateKey(new Date(item.solvedAt)) === dateKey),
  );

  if (alreadySolved) {
    return { streak: await getStreak(), solved, alreadySolved: true };
  }

  const lastSolved = await getLastSolved();
  let streak = await getStreak();
  const isNewDay = !lastSolved || !isSameDay(lastSolved, now);

  if (isNewDay) {
    if (lastSolved && isYesterday(lastSolved, now)) {
      streak += 1;
    } else {
      streak = 1;
    }

    await AsyncStorage.setItem(STREAK_KEY, String(streak));
    await AsyncStorage.setItem(LAST_SOLVED_KEY, now.toISOString());
  }

  const solvedEntry = {
    ...puzzle,
    solvedAt: now.toISOString(),
    dailyDateKey: dateKey,
    streak,
  };
  const newSolved = [solvedEntry, ...solved];
  await AsyncStorage.setItem(SOLVED_PUZZLES_KEY, JSON.stringify(newSolved));

  const state = await readJson(DAILY_STATE_KEY, null);
  if (state?.dateKey === dateKey) {
    await AsyncStorage.setItem(
      DAILY_STATE_KEY,
      JSON.stringify({ ...state, completed: true, hintVisible: false }),
    );
  }

  return { streak, solved: newSolved, alreadySolved: false };
};

export const markPuzzleSolved = (puzzle, now = new Date()) => {
  if (!puzzleSolvePromise) {
    puzzleSolvePromise = saveSolvedPuzzle(puzzle, now).finally(() => {
      puzzleSolvePromise = null;
    });
  }
  return puzzleSolvePromise;
};

const isSameDay = (date1, date2) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

const isYesterday = (date1, date2) => {
  const yesterday = new Date(date2);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date1, yesterday);
};

export const canSolveToday = async (now = new Date()) => {
  const dateKey = getLocalDateKey(now);
  const solved = await getSolvedPuzzles();
  return !solved.some(
    (item) =>
      item.dailyDateKey === dateKey ||
      (!item.dailyDateKey &&
        item.solvedAt &&
        getLocalDateKey(new Date(item.solvedAt)) === dateKey),
  );
};
