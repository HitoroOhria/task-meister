import Shortcut, { shortcuts } from "~/enum/Shortcut";
import ArrowKeyUseCase from "~/useCase/ArrowKeyUseCase";
import MindMapData from "~/domain/model/MindMapData";
import { newAddNode } from "~/domain/model/Node";
import {
  assertNever,
  newNotFoundChildrenErr,
  newNotFoundNodeErr,
} from "~/util/ExceptionUtil";

class ShortcutUseCase {
  private arrowKeyUseCase: ArrowKeyUseCase;

  constructor(arrowKeyUseCase: ArrowKeyUseCase) {
    this.arrowKeyUseCase = arrowKeyUseCase;
  }

  public handleKeydown(
    mindMapData: MindMapData,
    key: Shortcut,
    selectedNodeId: string
  ): MindMapData {
    switch (key) {
      case shortcuts.Up:
      case shortcuts.Down:
      case shortcuts.Right:
      case shortcuts.Left:
        return this.arrowKeyUseCase.handleArrowKeyDown(
          mindMapData,
          key,
          selectedNodeId
        );
      case shortcuts.Space:
        return this.toggleCollapse(mindMapData, selectedNodeId);
      case shortcuts.Tab:
        return this.addNodeToTail(mindMapData, selectedNodeId);
      case shortcuts.Enter:
        return this.addNodeToBottom(mindMapData, selectedNodeId);
      default:
        assertNever(key, `Not defined key. key = ${key}`);
        return mindMapData;
    }
  }

  public toggleCollapse(
    mindMapData: MindMapData,
    selectedNodeId: string
  ): MindMapData {
    mindMapData.rightMap.collapseNodes(selectedNodeId);
    return mindMapData;
  }

  public addNodeToTail(
    mindMapData: MindMapData,
    selectedNodeId: string
  ): MindMapData {
    mindMapData.deselectNode();
    mindMapData.isInputting = true;

    // TODO Fix when select RootNode.

    const addedNode = newAddNode();
    const selectedNode =
      mindMapData.rightMap.children.recursively.findNodeById(selectedNodeId);
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId);
    }

    // TODO Whey set left? There is top?
    addedNode.left = selectedNode.left + selectedNode.width;
    selectedNode.children.nodes.push(addedNode);

    return mindMapData;
  }

  public addNodeToBottom(
    mindMapData: MindMapData,
    selectedId: string
  ): MindMapData {
    mindMapData.deselectNode();
    mindMapData.isInputting = true;

    if (mindMapData.isFirstLayerNode(selectedId)) {
      const addedNode = newAddNode();
      addedNode.left = mindMapData.rootNode.width / 2;
      mindMapData.rightMap.children.insertChildToBottomOf(
        selectedId,
        addedNode
      );
      return mindMapData;
    }

    const addedNode = newAddNode();
    const selectedNode =
      mindMapData.rightMap.children.recursively.findNodeById(selectedId);
    const parentChildren =
      mindMapData.rightMap.children.recursively.findChildrenContainsId(
        selectedId
      );
    if (!parentChildren || !selectedNode) {
      throw newNotFoundChildrenErr(selectedId);
    }

    addedNode.left = selectedNode.left;
    parentChildren.insertChildToBottomOf(selectedId, addedNode);

    return mindMapData;
  }
}

export default ShortcutUseCase;
