import { arrowKeys } from "~/enum/ArrowKeys";

export const shortcuts = {
  ...arrowKeys,
  Space: " ",
  Tab: "Tab",
} as const;

export type Shortcut = typeof shortcuts[keyof typeof shortcuts];

export const getShortcut = (key: string): Shortcut | null => {
  switch (key) {
    case shortcuts.Up:
      return shortcuts.Up;
    case shortcuts.Down:
      return shortcuts.Down;
    case shortcuts.Right:
      return shortcuts.Right;
    case shortcuts.Left:
      return shortcuts.Left;
    case shortcuts.Space:
      return shortcuts.Space;
    case shortcuts.Tab:
      return shortcuts.Tab;
    default:
      return null;
  }
};

export default Shortcut;
