import { arrowKeys } from '~/enum/ArrowKeys'

export const shortcuts = {
  ...arrowKeys,
  C: 'c',
  Space: ' ',
  Tab: 'Tab',
  Enter: 'Enter',
  Backspace: 'Backspace',
  ShiftEnter: 'ShiftEnter',
  MetaE: 'MetaE',
  MetaEnter: 'MetaEnter',
  F6: 'F6',
} as const

export type Shortcut = typeof shortcuts[keyof typeof shortcuts]

export const isMovingScreen = (key: Shortcut): boolean => {
  switch (key) {
    case shortcuts.Space:
    case shortcuts.Up:
    case shortcuts.Down:
    case shortcuts.Right:
    case shortcuts.Left:
      return true
    default:
      return false
  }
}

export default Shortcut
