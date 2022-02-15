import Shortcut, { shortcuts } from "~/enum/Shortcut";
import { getArrowKey } from "~/enum/ArrowKeys";

class KeyCombo {
  private preKey: string;
  private curKey: string;

  constructor() {
    this.preKey = "";
    this.curKey = "";
  }

  public add(newKey: string) {
    this.preKey = this.curKey;
    this.curKey = newKey;
  }

  public getShortcut = (): Shortcut | undefined => {
    switch (true) {
      case this.isShiftEnter():
        return shortcuts.ShiftEnter;
      case this.isMetaE():
        return shortcuts.MetaE;
    }

    switch (this.curKey) {
      case getArrowKey(this.curKey):
        return getArrowKey(this.curKey);
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
    return this.preKey === "Shift" && this.curKey === "Enter";
  }

  private isMetaE(): boolean {
    return this.preKey === "Meta" && this.curKey === "e";
  }
}

export default KeyCombo;
