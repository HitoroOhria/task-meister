export const shortcuts = {
  Space: " ",
} as const;

export type Shortcut = typeof shortcuts[keyof typeof shortcuts];

export const getShortcut = (key: string): Shortcut | null => {
  switch (key) {
    case shortcuts.Space:
      return shortcuts.Space;
    default:
      return null;
  }
};

export default Shortcut;
