import { assertNever } from "~/util/ExceptionUtil";
import Shortcut, { ArrowKey, arrowKeys, shortcuts } from "~/enum/Shortcut";
import MindMapData from "~/domain/model/MindMapData";

type ShortcutController = {
  mindMapData: MindMapData | undefined;

  handleKeydown(key: string, selectedNodeId: string): MindMapData;

  handleArrowKeyDown(arrowKey: ArrowKey, selectedId: string): MindMapData;

  selectTopNodeId(selectedNodeId: string): MindMapData;

  selectBottomNodeId(selectedNodeId: string): MindMapData;

  selectRightNodeId(selectedNodeId: string): MindMapData;

  selectLeftNodeId(selectedNodeId: string): MindMapData;
};

export const newShortcutController = (
  mindMapData: MindMapData
): ShortcutController => {
  return {
    ...shortcutControllerImpl,
    mindMapData: mindMapData,
  };
};

export const shortcutControllerImpl: ShortcutController = {
  mindMapData: undefined,

  // TODO Can move process of MindMapData to ShortcutController?
  handleKeydown(key: Shortcut, selectedNodeId: string): MindMapData {
    switch (key) {
      case shortcuts.Up:
      case shortcuts.Down:
      case shortcuts.Right:
      case shortcuts.Left:
        return this.handleArrowKeyDown(key, selectedNodeId);
      case shortcuts.Space:
        this.mindMapData!.handlePressSpace(selectedNodeId);
        break;
      case shortcuts.Tab:
        console.log("pressed Tab");
        break;
      default:
        assertNever(key, `Not defined key. key = ${key}`);
    }

    return this.mindMapData!;
  },

  handleArrowKeyDown(arrowKey: ArrowKey, selectedId: string): MindMapData {
    switch (arrowKey) {
      case arrowKeys.Up:
        return this.selectTopNodeId(selectedId);
      case arrowKeys.Down:
        return this.selectBottomNodeId(selectedId);
      case arrowKeys.Right:
        return this.selectRightNodeId(selectedId);
      case arrowKeys.Left:
        return this.selectLeftNodeId(selectedId);
      default:
        assertNever(arrowKey, `Not defined arrow key. arrow key = ${arrowKey}`);
    }

    return this.mindMapData!;
  },

  selectTopNodeId(selectedNodeId: string): MindMapData {
    const topNodeId =
      this.mindMapData!.rightMapData.nodes.recursively.findChildrenContainsId(
        selectedNodeId
      )?.findTopNodeOf(selectedNodeId)?.id;
    if (topNodeId === undefined) {
      throw new Error(
        `Can not found NodeData by selected id. selected id = ${selectedNodeId}`
      );
    }

    this.mindMapData!.selectedNodeId = topNodeId;
    return this.mindMapData!;
  },

  selectBottomNodeId(selectedNodeId: string): MindMapData {
    const bottomNodeId =
      this.mindMapData!.rightMapData.nodes.recursively.findChildrenContainsId(
        selectedNodeId
      )?.findBottomNodeOf(selectedNodeId)?.id;
    if (bottomNodeId === undefined) {
      throw new Error(
        `Can not found NodeData by selected id. selected id = ${selectedNodeId}`
      );
    }

    this.mindMapData!.selectedNodeId = bottomNodeId;
    return this.mindMapData!;
  },

  selectRightNodeId(selectedNodeId: string): MindMapData {
    const rightNodeId =
      this.mindMapData!.rightMapData.nodes.recursively.findChildrenContainsId(
        selectedNodeId
      )?.findRightNodeOf(selectedNodeId)?.id;
    if (rightNodeId === undefined) {
      return this.mindMapData!;
    }

    this.mindMapData!.selectedNodeId = rightNodeId;
    return this.mindMapData!;
  },

  // TODO Select root node.
  selectLeftNodeId(selectedNodeId: string): MindMapData {
    const leftNodeId =
      this.mindMapData!.rightMapData.nodes.recursively.findChildHasGrandChildId(
        selectedNodeId
      )?.id;
    if (leftNodeId === undefined) return this.mindMapData!;

    this.mindMapData!.selectedNodeId = leftNodeId;
    return this.mindMapData!;
  },
};
Object.freeze(shortcutControllerImpl);

export default ShortcutController;
