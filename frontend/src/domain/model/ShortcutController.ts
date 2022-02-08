import { assertNever } from "~/util/ExceptionUtil";
import Shortcut, { shortcuts } from "~/enum/Shortcut";
import MindMapData, { mindMapDataImpl } from "~/domain/model/MindMapData";

type ShortcutController = {
  mindMapData: MindMapData;

  handleKeypress(key: string, id: string): void;
};

export const newShortcutController = (
  mindMapData: MindMapData
): ShortcutController => {
  return {
    ...shortcutControllerImpl,
    mindMapData: mindMapData,
  };
};

const shortcutControllerImpl: ShortcutController = {
  mindMapData: mindMapDataImpl,

  // TODO Can move process of MindMapData to ShortcutController?
  handleKeypress(key: Shortcut, id: string) {
    switch (key) {
      case shortcuts.Space:
        this.mindMapData.handlePressSpace(id);
        break;
      default:
        assertNever(key, `Not defined key. key = ${key}`);
    }
  },
};
Object.freeze(shortcutControllerImpl);

export default ShortcutController;
