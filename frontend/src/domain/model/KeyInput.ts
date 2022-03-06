import Shortcut, { shortcuts } from '~/enum/Shortcut'
import ArrowKey, { arrowKeys } from '~/enum/ArrowKeys'

class KeyInput {
  // Currently pressed key.
  private pressKeys: string[]

  // Last pressed key.
  private currentKey: string

  constructor() {
    this.pressKeys = []
    this.currentKey = ''
  }

  // Add key.
  public add(newKey: string) {
    this.pressKeys.push(newKey)
    this.currentKey = newKey
  }

  // Remove key from pressKeys.
  public leave(leaveKey: string) {
    this.pressKeys = this.pressKeys.filter((key) => key !== leaveKey)
  }

  // Get arrow key.
  public getArrowKey = (): ArrowKey | undefined => {
    switch (this.currentKey) {
      case arrowKeys.Up:
        return arrowKeys.Up
      case arrowKeys.Down:
        return arrowKeys.Down
      case arrowKeys.Right:
        return arrowKeys.Right
      case arrowKeys.Left:
        return arrowKeys.Left
      default:
        return undefined
    }
  }

  // Get shortcut.
  public getShortcut = (): Shortcut | undefined => {
    // Sort in desc order of probability.

    switch (true) {
      case this.isMetaE():
        return shortcuts.MetaE
      case this.isMetaEnter():
        return shortcuts.MetaEnter
      case this.isShiftEnter():
        return shortcuts.ShiftEnter
    }

    switch (this.currentKey) {
      case shortcuts.Tab:
        return shortcuts.Tab
      case shortcuts.Enter:
        return shortcuts.Enter
      case shortcuts.Backspace:
        return shortcuts.Backspace
      case shortcuts.C:
        return shortcuts.C
      case shortcuts.T:
        return shortcuts.T
      case shortcuts.Space:
        return shortcuts.Space
      case shortcuts.F6:
        return shortcuts.F6
      default:
        return undefined
    }
  }

  private isShiftEnter(): boolean {
    return this.currentKey === 'Enter' && this.isPressKey('Shift')
  }

  private isMetaE(): boolean {
    return this.currentKey === 'e' && this.isPressKey('Meta')
  }

  private isMetaEnter(): boolean {
    return this.currentKey === 'Enter' && this.isPressKey('Meta')
  }

  private isPressKey(key: string): boolean {
    return this.pressKeys.includes(key)
  }
}

export default KeyInput
