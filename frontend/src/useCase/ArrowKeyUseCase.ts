import ArrowKey, { arrowKeys } from "~/enum/ArrowKeys";
import MindMapData from "~/domain/model/MindMapData";
import { assertNever, newNotFoundNodeErr } from "~/util/ExceptionUtil";
import RootNode from "~/domain/model/RootNode";
import Node from "~/domain/model/Node";

class ArrowKeyUseCase {
  handleArrowKeyDown(
    mindMapData: MindMapData,
    arrowKey: ArrowKey,
    selectedNode: RootNode | Node
  ): MindMapData {
    switch (arrowKey) {
      case arrowKeys.Up:
        return this.selectTopNode(mindMapData, selectedNode);
      case arrowKeys.Down:
        return this.selectBottomNode(mindMapData, selectedNode);
      case arrowKeys.Right:
        return this.selectTailNode(mindMapData, selectedNode);
      case arrowKeys.Left:
        return this.selectHeadNode(mindMapData, selectedNode);
      default:
        assertNever(arrowKey, `Not defined arrow key. arrow key = ${arrowKey}`);
        return mindMapData;
    }
  }

  selectTopNode(
    mindMapData: MindMapData,
    selectedNode: RootNode | Node
  ): MindMapData {
    if (mindMapData.rootNode.isSelected) {
      return mindMapData;
    }

    mindMapData.deselectNode();

    const topNode = mindMapData.rightMap.children.recursively
      .findChildrenContainsId(selectedNode.id)
      ?.findTopNodeOf(selectedNode.id);
    if (!topNode) {
      throw newNotFoundNodeErr(selectedNode.id);
    }

    topNode.isSelected = true;
    return mindMapData;
  }

  selectBottomNode(
    mindMapData: MindMapData,
    selectedNode: RootNode | Node
  ): MindMapData {
    mindMapData.deselectNode();

    const bottomNode = mindMapData.rightMap.children.recursively
      .findChildrenContainsId(selectedNode.id)
      ?.findBottomNodeOf(selectedNode.id);
    if (!bottomNode) {
      throw newNotFoundNodeErr(selectedNode.id);
    }

    bottomNode.isSelected = true;
    return mindMapData;
  }

  selectHeadNode(
    mindMapData: MindMapData,
    selectedNode: RootNode | Node
  ): MindMapData {
    if (mindMapData.isFirstLayerNode(selectedNode.id)) {
      mindMapData.deselectNode();
      mindMapData.rootNode.isSelected = true;
      return mindMapData;
    }

    const leftNode =
      mindMapData.rightMap.children.recursively.findNodeHasGrandChildId(
        selectedNode.id
      );
    if (!leftNode) {
      return mindMapData;
    }

    mindMapData.deselectNode();
    leftNode.isSelected = true;

    return mindMapData;
  }

  selectTailNode(
    mindMapData: MindMapData,
    selectedNode: RootNode | Node
  ): MindMapData {
    if (mindMapData.rootNode.isSelected) {
      mindMapData.selectTail();
      return mindMapData;
    }

    const tailNode = mindMapData.rightMap.children.recursively
      .findChildrenContainsId(selectedNode.id)
      ?.findTailNodeOf(selectedNode.id);
    if (!tailNode) {
      return mindMapData;
    }

    mindMapData.deselectNode();
    tailNode.isSelected = true;

    return mindMapData;
  }
}

export default ArrowKeyUseCase;
