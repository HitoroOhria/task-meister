type ArrowKey = typeof arrowKeys[keyof typeof arrowKeys]

export const arrowKeys = {
  Up: 'ArrowUp',
  Down: 'ArrowDown',
  Right: 'ArrowRight',
  Left: 'ArrowLeft',
} as const

export default ArrowKey
