import MindMapData from "~/domain/model/MindMapData";
import { newNode } from "~/domain/model/Node";
import Shortcut, { shortcuts } from "~/enum/Shortcut";
import ArrowKey, { arrowKeys } from "~/enum/ArrowKeys";
import { assertNever } from "~/util/ExceptionUtil";
import { newChildren } from "~/domain/model/Children";
import _ from "lodash";
import { newGroup } from "~/domain/model/Group";

type ShortcutController = {
  mindMapData: MindMapData;

  handleKeydown(key: string, selectedNodeId: string): MindMapData;

  handleArrowKeyDown(arrowKey: ArrowKey, selectedId: string): MindMapData;

  selectTopNodeId(selectedNodeId: string): MindMapData;

  selectBottomNodeId(selectedNodeId: string): MindMapData;

  selectHeadNodeId(selectedNodeId: string): MindMapData;

  selectTailNodeId(selectedNodeId: string): MindMapData;

  toggleCollapse(id: string): MindMapData;

  addNodeToTail(selectedId: string): MindMapData;
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
  mindMapData: {} as MindMapData,

  // TODO Can move process of MindMapData to ShortcutController?
  handleKeydown(key: Shortcut, selectedNodeId: string): MindMapData {
    switch (key) {
      case shortcuts.Up:
      case shortcuts.Down:
      case shortcuts.Right:
      case shortcuts.Left:
        return this.handleArrowKeyDown(key, selectedNodeId);
      case shortcuts.Space:
        return this.toggleCollapse(selectedNodeId);
      case shortcuts.Tab:
        return this.addNodeToTail(selectedNodeId);
      default:
        assertNever(key, `Not defined key. key = ${key}`);
    }

    return this.mindMapData;
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

    return this.mindMapData;
  },

  selectTopNodeId(selectedNodeId: string): MindMapData {
    this.mindMapData.deselectNode();

    const topNode = this.mindMapData.rightMap.nodes.recursively
      .findChildrenContainsId(selectedNodeId)
      ?.findTopNodeOf(selectedNodeId);
    if (!topNode) {
      throw new Error(
        `Can not found NodeData by selected id. selected id = ${selectedNodeId}`
      );
    }

    topNode.isSelected = true;
    return this.mindMapData;
  },

  selectBottomNodeId(selectedNodeId: string): MindMapData {
    this.mindMapData.deselectNode();

    const bottomNode = this.mindMapData.rightMap.nodes.recursively
      .findChildrenContainsId(selectedNodeId)
      ?.findBottomNodeOf(selectedNodeId);
    if (!bottomNode) {
      throw new Error(
        `Can not found NodeData by selected id. selected id = ${selectedNodeId}`
      );
    }

    bottomNode.isSelected = true;
    return this.mindMapData;
  },

  // TODO Select root node.
  selectHeadNodeId(selectedNodeId: string): MindMapData {
    const leftNode =
      this.mindMapData.rightMap.nodes.recursively.findChildHasGrandChildId(
        selectedNodeId
      );
    if (!leftNode) {
      return this.mindMapData;
    }

    this.mindMapData.deselectNode();
    leftNode.isSelected = true;

    return this.mindMapData;
  },

  selectTailNodeId(selectedNodeId: string): MindMapData {
    const rightNode = this.mindMapData.rightMap.nodes.recursively
      .findChildrenContainsId(selectedNodeId)
      ?.findTailNodeOf(selectedNodeId);
    if (!rightNode) {
      return this.mindMapData;
    }

    this.mindMapData.deselectNode();
    rightNode.isSelected = true;

    return this.mindMapData;
  },

  toggleCollapse(selectedNodeId: string): MindMapData {
    this.mindMapData.rightMap.collapseNodes(selectedNodeId);
    return this.mindMapData;
  },

  addNodeToTail(selectedId: string): MindMapData {
    // TODO Why called twice?
    //   - but, below log is once
    console.log("addNodeToTail")
    this.mindMapData.deselectNode();

    const addedNode = newNode(
      _.uniqueId("node_"),
      "",
      newGroup(),
      newChildren([])
    );
    addedNode.isInputting = true;
    addedNode.isSelected = true;

    const selectedNode =
      this.mindMapData.rightMap.nodes.recursively.findChildById(selectedId);
    if (!selectedNode) {
      throw new Error(`Can not found Node by id. id = ${selectedNode}`);
    }
    selectedNode.children.nodes.push(addedNode);

    return this.mindMapData;
  },
};
Object.freeze(shortcutControllerImpl);

export default ShortcutController;
