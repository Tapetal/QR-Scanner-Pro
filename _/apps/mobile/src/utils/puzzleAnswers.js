export const normalizePuzzleAnswer = (answer) =>
  answer
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

export const isPuzzleAnswerCorrect = (guess, answer) =>
  normalizePuzzleAnswer(guess) === normalizePuzzleAnswer(answer);
