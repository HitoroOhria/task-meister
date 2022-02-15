import { arrowKeys } from "~/enum/ArrowKeys";

export const shortcuts = {
  ...arrowKeys,
  Space: " ",
  Tab: "Tab",
  Enter: "Enter",
  Backspace: "Backspace",
  ShiftEnter: "ShiftEnter",
  MetaE: "MetaE",
} as const;

export type Shortcut = typeof shortcuts[keyof typeof shortcuts];

export default Shortcut;
