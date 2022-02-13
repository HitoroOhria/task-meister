import ArrowKey, { arrowKeys } from "~/enum/ArrowKeys";
import MindMapData from "~/domain/model/MindMapData";
import { assertNever } from "~/util/ExceptionUtil";

class ArrowKeyUseCase {
  handleArrowKeyDown(
    mindMapData: MindMapData,
    arrowKey: ArrowKey,
    selectedId: string
  ): MindMapData {
    switch (arrowKey) {
      case arrowKeys.Up:
        return this.selectTopNode(mindMapData, selectedId);
      case arrowKeys.Down:
        return this.selectBottomNode(mindMapData, selectedId);
      case arrowKeys.Right:
        return this.selectTailNode(mindMapData, selectedId);
      case arrowKeys.Left:
        return this.selectHeadNode(mindMapData, selectedId);
      default:
        assertNever(arrowKey, `Not defined arrow key. arrow key = ${arrowKey}`);
        return mindMapData;
    }
  }

  selectTopNode(mindMapData: MindMapData, selectedNodeId: string): MindMapData {
    mindMapData.deselectNode();

    const topNode = mindMapData.rightMap.children.recursively
      .findChildrenContainsId(selectedNodeId)
      ?.findTopNodeOf(selectedNodeId);
    if (!topNode) {
      throw new Error(
        `Can not found NodeData by selected id. selected id = ${selectedNodeId}`
      );
    }

    topNode.isSelected = true;
    return mindMapData;
  }

  selectBottomNode(
    mindMapData: MindMapData,
    selectedNodeId: string
  ): MindMapData {
    mindMapData.deselectNode();

    const bottomNode = mindMapData.rightMap.children.recursively
      .findChildrenContainsId(selectedNodeId)
      ?.findBottomNodeOf(selectedNodeId);
    if (!bottomNode) {
      throw new Error(
        `Can not found NodeData by selected id. selected id = ${selectedNodeId}`
      );
    }

    bottomNode.isSelected = true;
    return mindMapData;
  }

  // TODO Select root node.
  selectHeadNode(
    mindMapData: MindMapData,
    selectedNodeId: string
  ): MindMapData {
    if (mindMapData.isFirstLayerNode(selectedNodeId)) {
      mindMapData.deselectNode();
      mindMapData.rootNode.isSelected = true;
      return mindMapData;
    }

    const leftNode =
      mindMapData.rightMap.children.recursively.findNodeHasGrandChildId(
        selectedNodeId
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
    selectedNodeId: string
  ): MindMapData {
    // TODO Why not call when selected RootNode?
    if (mindMapData.rootNode.isSelected) {
      mindMapData.selectTail();
      return mindMapData;
    }

    const tailNode = mindMapData.rightMap.children.recursively
      .findChildrenContainsId(selectedNodeId)
      ?.findTailNodeOf(selectedNodeId);
    if (!tailNode) {
      return mindMapData;
    }

    mindMapData.deselectNode();
    tailNode.isSelected = true;

    return mindMapData;
  }
}

export default ArrowKeyUseCase;
