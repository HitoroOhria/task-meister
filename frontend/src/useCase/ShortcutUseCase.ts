import Shortcut, { shortcuts } from "~/enum/Shortcut";
import ArrowKeyUseCase from "~/useCase/ArrowKeyUseCase";
import MindMapData from "~/domain/model/MindMapData";
import Node, { newAddNode } from "~/domain/model/Node";
import { assertNever, newNotFoundChildrenErr } from "~/util/ExceptionUtil";
import RootNode, { rootNodeType } from "~/domain/model/RootNode";

class ShortcutUseCase {
  private arrowKeyUseCase: ArrowKeyUseCase;

  constructor(arrowKeyUseCase: ArrowKeyUseCase) {
    this.arrowKeyUseCase = arrowKeyUseCase;
  }

  public handleKeydown(mindMapData: MindMapData, key: Shortcut): MindMapData {
    const selectedNode = mindMapData.findNodeIsSelected();
    if (!selectedNode) {
      return mindMapData;
    }

    switch (key) {
      case shortcuts.Up:
      case shortcuts.Down:
      case shortcuts.Right:
      case shortcuts.Left:
        return this.arrowKeyUseCase.handleArrowKeyDown(
          mindMapData,
          key,
          selectedNode
        );
      case shortcuts.Space:
        return this.toggleCollapse(mindMapData, selectedNode);
      case shortcuts.Tab:
        return this.addNodeToTail(mindMapData, selectedNode);
      case shortcuts.Enter:
        return this.addNodeToBottom(mindMapData, selectedNode);
      default:
        assertNever(key, `Not defined key. key = ${key}`);
        return mindMapData;
    }
  }

  public toggleCollapse(
    mindMapData: MindMapData,
    selectedNode: RootNode | Node
  ): MindMapData {
    if (mindMapData.rootNode.isSelected) {
      return mindMapData;
    }

    mindMapData.rightMap.collapseNodes(selectedNode.id);
    return mindMapData;
  }

  public addNodeToTail(
    mindMapData: MindMapData,
    selectedNode: RootNode | Node
  ): MindMapData {
    mindMapData.deselectNode();
    mindMapData.isInputting = true;

    if (selectedNode.type === rootNodeType) {
      const addedNode = newAddNode(mindMapData.rootNode.width / 2);
      mindMapData.rightMap.children.nodes.push(addedNode);
      return mindMapData;
    }

    // TODO Whey set left? There is top?
    const addedNode = newAddNode(selectedNode.left + selectedNode.width);
    selectedNode.children.nodes.push(addedNode);

    return mindMapData;
  }

  public addNodeToBottom(
    mindMapData: MindMapData,
    selectedNode: RootNode | Node
  ): MindMapData {
    if (mindMapData.rootNode.isSelected) {
      return mindMapData;
    }

    mindMapData.deselectNode();
    mindMapData.isInputting = true;

    const parentChildren =
      mindMapData.rightMap.children.recursively.findChildrenContainsId(
        selectedNode.id
      );
    if (!parentChildren) {
      throw newNotFoundChildrenErr(selectedNode.id);
    }

    const addedNode = mindMapData.isFirstLayerNode(selectedNode.id)
      ? newAddNode(mindMapData.rootNode.width / 2)
      : newAddNode(selectedNode.left);
    parentChildren.insertChildToBottomOf(selectedNode.id, addedNode);

    return mindMapData;
  }
}

export default ShortcutUseCase;