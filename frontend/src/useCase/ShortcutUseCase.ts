import Shortcut, { shortcuts } from "~/enum/Shortcut";
import MindMapData from "~/domain/model/MindMapData";
import { assertNever } from "~/util/ExceptionUtil";
import { newNode } from "~/domain/model/Node";
import _ from "lodash";
import { newGroup } from "~/domain/model/Group";
import { newChildren } from "~/domain/model/Children";
import ArrowKeyUseCase from "~/useCase/ArrowKeyUseCase";

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
    selectedId: string
  ): MindMapData {
    mindMapData.deselectNode();

    // TODO Create constructor
    const addedNode = newNode(
      _.uniqueId("node_"),
      "",
      newGroup(),
      newChildren([])
    );
    addedNode.isInputting = true;
    addedNode.isSelected = true;

    const selectedNode =
      mindMapData.rightMap.children.recursively.findNodeById(selectedId);
    if (!selectedNode) {
      throw new Error(`Can not found Node by id. id = ${selectedNode}`);
    }
    selectedNode.children.nodes.push(addedNode);
    addedNode.left = selectedNode.left + selectedNode.width;

    return mindMapData;
  }
}

export default ShortcutUseCase;
