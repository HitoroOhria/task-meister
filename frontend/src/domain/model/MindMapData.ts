import RootNode, { rootNodeImpl } from "~/domain/model/RootNode";
import RightMap, { rightMapImpl } from "~/domain/model/RightMap";
import ShortcutController, {
  newShortcutController,
  shortcutControllerImpl,
} from "~/domain/model/ShortcutController";
import DropPosition from "~/domain/model/DropPosition";
import NodeData from "~/domain/model/NodeData";

type MindMapData = {
  // TODO Control readonly, geet, set
  isInputting: boolean;
  rootNode: RootNode;
  rightMap: RightMap;
  leftMap: RightMap;
  shortcutController: ShortcutController;

  findNodeById(id: string): NodeData | undefined;

  deselectNode(): void;

  handleTextChanges(id: string, width: number, height: number): void;

  processRootNodeTextChanges(width: number, height: number): void;

  updateRightNodesLeft(): void;

  handleDropNode(id: string, dropPosition: DropPosition): void;
};

export const newMindMapData = (
  rootNode: RootNode,
  rightMap: RightMap,
  leftMap: RightMap
): MindMapData => {
  const mindMapData: MindMapData = {
    ...mindMapDataImpl,
    rootNode: rootNode,
    rightMap: rightMap,
    leftMap: leftMap,
  };
  mindMapData.shortcutController = newShortcutController(mindMapData);

  return mindMapData;
};

export const mindMapDataImpl: MindMapData = {
  isInputting: false,
  rootNode: rootNodeImpl,
  rightMap: rightMapImpl,
  leftMap: rightMapImpl,
  shortcutController: shortcutControllerImpl,

  findNodeById(id: string): NodeData | undefined {
    if (this.rootNode.id === id) {
      return this.rootNode;
    }

    return this.rightMap.nodes.recursively.findChildById(id);
  },

  deselectNode() {
    if (this.rootNode.isSelected) {
      this.rootNode.isSelected = false;
      return;
    }

    this.rightMap.nodes.recursively.deselectChild();
  },

  handleTextChanges(id: string, width: number, height: number) {
    if (id === this.rootNode.id) {
      this.processRootNodeTextChanges(width, height);
      return;
    }

    this.rightMap.handleTextChanges(id, width, height);
  },

  processRootNodeTextChanges(width: number, height: number) {
    this.rootNode.updateLateral(width);
    this.rootNode.updateVertical(height);
    this.updateRightNodesLeft();
  },

  updateRightNodesLeft() {
    this.rightMap.nodes.recursively.setNodeLeft(
      this.rootNode.left,
      this.rootNode.width
    );
  },

  handleDropNode(movedNodeId: string, dropPosition: DropPosition) {
    this.rightMap.handleDropNode(movedNodeId, dropPosition);
  },
};

Object.freeze(mindMapDataImpl);

export default MindMapData;
