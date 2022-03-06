export type Shortcut = typeof shortcuts[keyof typeof shortcuts]

export const shortcuts = {
  C: 'c',
  T: 't',
  Space: ' ',
  Tab: 'Tab',
  Enter: 'Enter',
  Backspace: 'Backspace',
  ShiftEnter: 'ShiftEnter',
  MetaE: 'MetaE',
  MetaEnter: 'MetaEnter',
  F6: 'F6',
} as const

// Check key that move screen.
export const isMovingScreen = (key: Shortcut): boolean => {
  switch (key) {
    case shortcuts.Space:
      return true
    default:
      return false
  }
}

export default Shortcut
