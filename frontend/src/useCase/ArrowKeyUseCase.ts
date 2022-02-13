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
        return this.selectTopNodeId(mindMapData, selectedId);
      case arrowKeys.Down:
        return this.selectBottomNodeId(mindMapData, selectedId);
      case arrowKeys.Right:
        return this.selectTailNodeId(mindMapData, selectedId);
      case arrowKeys.Left:
        return this.selectHeadNodeId(mindMapData, selectedId);
      default:
        assertNever(arrowKey, `Not defined arrow key. arrow key = ${arrowKey}`);
        return mindMapData;
    }
  }

  selectTopNodeId(
    mindMapData: MindMapData,
    selectedNodeId: string
  ): MindMapData {
    mindMapData.deselectNode();

    const topNode = mindMapData.rightMap.nodes.recursively
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

  selectBottomNodeId(
    mindMapData: MindMapData,
    selectedNodeId: string
  ): MindMapData {
    mindMapData.deselectNode();

    const bottomNode = mindMapData.rightMap.nodes.recursively
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
  selectHeadNodeId(
    mindMapData: MindMapData,
    selectedNodeId: string
  ): MindMapData {
    const leftNode =
      mindMapData.rightMap.nodes.recursively.findChildHasGrandChildId(
        selectedNodeId
      );
    if (!leftNode) {
      return mindMapData;
    }

    mindMapData.deselectNode();
    leftNode.isSelected = true;

    return mindMapData;
  }

  selectTailNodeId(
    mindMapData: MindMapData,
    selectedNodeId: string
  ): MindMapData {
    const rightNode = mindMapData.rightMap.nodes.recursively
      .findChildrenContainsId(selectedNodeId)
      ?.findTailNodeOf(selectedNodeId);
    if (!rightNode) {
      return mindMapData;
    }

    mindMapData.deselectNode();
    rightNode.isSelected = true;

    return mindMapData;
  }
}

export default ArrowKeyUseCase;
