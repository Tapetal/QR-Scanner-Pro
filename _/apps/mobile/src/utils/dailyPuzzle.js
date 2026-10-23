export const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const hashSeed = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const seededShuffle = (items, seed) => {
  const shuffled = [...items];
  let state = hashSeed(seed) || 1;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const target = (state >>> 0) % (index + 1);
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }

  return shuffled;
};

export const chooseDailyPuzzle = (
  puzzleBank,
  installationId,
  dateKey,
  recentPuzzleIds = [],
) => {
  if (!puzzleBank.length) {
    throw new Error("Cannot choose a daily puzzle from an empty question bank.");
  }

  const recentIds = new Set(recentPuzzleIds.map(String));
  const unusedPuzzles = puzzleBank.filter(
    (puzzle) => !recentIds.has(String(puzzle.id)),
  );
  const candidates = unusedPuzzles.length ? unusedPuzzles : puzzleBank;

  return seededShuffle(candidates, `${installationId}:${dateKey}`)[0];
};
