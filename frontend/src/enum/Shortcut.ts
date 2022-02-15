import { arrowKeys, getArrowKey } from "~/enum/ArrowKeys";

export const shortcuts = {
  ...arrowKeys,
  Space: " ",
  Tab: "Tab",
  Enter: "Enter",
  Backspace: "Backspace",
} as const;

export type Shortcut = typeof shortcuts[keyof typeof shortcuts];

export const getShortcut = (key: string): Shortcut | undefined => {
  switch (key) {
    case getArrowKey(key):
      return getArrowKey(key);
    case shortcuts.Space:
      return shortcuts.Space;
    case shortcuts.Tab:
      return shortcuts.Tab;
    case shortcuts.Enter:
      return shortcuts.Enter;
    case shortcuts.Backspace:
      return shortcuts.Backspace;
    default:
      return undefined;
  }
};

export default Shortcut;
