import Shortcut, { shortcuts } from "~/enum/Shortcut";
import { getArrowKey } from "~/enum/ArrowKeys";

class KeyCombo {
  // Currently pressed key
  public pressKeys: string[];

  // Last pressed key
  private currentKey: string;

  constructor() {
    this.pressKeys = [];
    this.currentKey = "";
  }

  public add(newKey: string) {
    this.pressKeys.push(newKey);
    this.currentKey = newKey;
  }

  public up(upKey: string) {
    this.pressKeys = this.pressKeys.filter((key) => key !== upKey);
  }

  public getShortcut = (): Shortcut | undefined => {
    switch (true) {
      case this.isShiftEnter():
        return shortcuts.ShiftEnter;
      case this.isMetaE():
        return shortcuts.MetaE;
    }

    switch (this.currentKey) {
      case getArrowKey(this.currentKey):
        return getArrowKey(this.currentKey);
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

  private isShiftEnter(): boolean {
    return this.currentKey === "Enter" && this.isPressKey("Shift");
  }

  private isMetaE(): boolean {
    return this.currentKey === "e" && this.isPressKey("Meta");
  }

  private isPressKey(key: string): boolean {
    return this.pressKeys.includes(key);
  }
}

export default KeyCombo;
