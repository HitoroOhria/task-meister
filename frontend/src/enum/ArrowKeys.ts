export const arrowKeys = {
  Up: "ArrowUp",
  Down: "ArrowDown",
  Right: "ArrowRight",
  Left: "ArrowLeft",
} as const;

type ArrowKey = typeof arrowKeys[keyof typeof arrowKeys];

export default ArrowKey;
