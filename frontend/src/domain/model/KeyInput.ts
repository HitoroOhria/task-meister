import Shortcut, { shortcuts } from '~/enum/Shortcut'
import { getArrowKey } from '~/enum/ArrowKeys'

class KeyInput {
  // Currently pressed key
  private pressKeys: string[]

  // Last pressed key
  private currentKey: string

  constructor() {
    this.pressKeys = []
    this.currentKey = ''
  }

  public add(newKey: string) {
    this.pressKeys.push(newKey)
    this.currentKey = newKey
  }

  public leave(leaveKey: string) {
    this.pressKeys = this.pressKeys.filter((key) => key !== leaveKey)
  }

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
      case getArrowKey(this.currentKey):
        return getArrowKey(this.currentKey)
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
