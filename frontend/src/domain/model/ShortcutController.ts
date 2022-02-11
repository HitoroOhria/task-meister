import MindMapData from "~/domain/model/MindMapData";
import Shortcut, { shortcuts } from "~/enum/Shortcut";
import ArrowKey, { arrowKeys } from "~/enum/ArrowKeys";
import { assertNever } from "~/util/ExceptionUtil";

type ShortcutController = {
  mindMapData: MindMapData | undefined;

  handleKeydown(key: string, selectedNodeId: string): MindMapData;

  handleArrowKeyDown(arrowKey: ArrowKey, selectedId: string): MindMapData;

  selectTopNodeId(selectedNodeId: string): MindMapData;

  selectBottomNodeId(selectedNodeId: string): MindMapData;

  selectHeadNodeId(selectedNodeId: string): MindMapData;

  selectTailNodeId(selectedNodeId: string): MindMapData;

  toggleCollapse(id: string): MindMapData;
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
        this.toggleCollapse(selectedNodeId);
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
        return this.selectTailNodeId(selectedId);
      case arrowKeys.Left:
        return this.selectHeadNodeId(selectedId);
      default:
        assertNever(arrowKey, `Not defined arrow key. arrow key = ${arrowKey}`);
    }

    return this.mindMapData!;
  },

  selectTopNodeId(selectedNodeId: string): MindMapData {
    const topNodeId =
      this.mindMapData!.rightMap.nodes.recursively.findChildrenContainsId(
        selectedNodeId
      )?.findTopNodeOf(selectedNodeId)?.id;
    if (!topNodeId) {
      throw new Error(
        `Can not found NodeData by selected id. selected id = ${selectedNodeId}`
      );
    }

    this.mindMapData!.selectedNodeId = topNodeId;
    return this.mindMapData!;
  },

  selectBottomNodeId(selectedNodeId: string): MindMapData {
    const bottomNodeId =
      this.mindMapData!.rightMap.nodes.recursively.findChildrenContainsId(
        selectedNodeId
      )?.findBottomNodeOf(selectedNodeId)?.id;
    if (!bottomNodeId) {
      throw new Error(
        `Can not found NodeData by selected id. selected id = ${selectedNodeId}`
      );
    }

    this.mindMapData!.selectedNodeId = bottomNodeId;
    return this.mindMapData!;
  },

  // TODO Select root node.
  selectHeadNodeId(selectedNodeId: string): MindMapData {
    const leftNodeId =
      this.mindMapData!.rightMap.nodes.recursively.findChildHasGrandChildId(
        selectedNodeId
      )?.id;
    if (!leftNodeId) return this.mindMapData!;

    this.mindMapData!.selectedNodeId = leftNodeId;
    return this.mindMapData!;
  },

  selectTailNodeId(selectedNodeId: string): MindMapData {
    const rightNodeId =
      this.mindMapData!.rightMap.nodes.recursively.findChildrenContainsId(
        selectedNodeId
      )?.findTailNodeOf(selectedNodeId)?.id;
    if (!rightNodeId) {
      return this.mindMapData!;
    }

    this.mindMapData!.selectedNodeId = rightNodeId;
    return this.mindMapData!;
  },

  toggleCollapse(selectedNodeId: string): MindMapData {
    this.mindMapData!.rightMap.collapseNodes(selectedNodeId);
    return this.mindMapData!
  },
};
Object.freeze(shortcutControllerImpl);

export default ShortcutController;
