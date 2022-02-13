export const arrowKeys = {
  Up: "ArrowUp",
  Down: "ArrowDown",
  Right: "ArrowRight",
  Left: "ArrowLeft",
} as const;

type ArrowKey = typeof arrowKeys[keyof typeof arrowKeys];

export const getArrowKey = (key: string): ArrowKey | undefined => {
  switch (key) {
    case arrowKeys.Up:
      return arrowKeys.Up;
    case arrowKeys.Down:
      return arrowKeys.Down;
    case arrowKeys.Right:
      return arrowKeys.Right;
    case arrowKeys.Left:
      return arrowKeys.Left;
    default:
      return undefined;
  }
};

export default ArrowKey;
