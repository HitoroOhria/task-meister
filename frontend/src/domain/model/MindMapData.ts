import RootNode, { rootNodeImpl } from "~/domain/model/RootNode";
import RightMap, { rightMapImpl } from "~/domain/model/RightMap";
import ShortcutController, {
  newShortcutController,
  shortcutControllerImpl,
} from "~/domain/model/ShortcutController";
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

  processRootNodeTextChanges(width: number, height: number): void;

  processNodeDropToRight(movedNodeId: string): void;
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

  processRootNodeTextChanges(width: number, height: number) {
    this.rootNode.updateLateral(width);
    this.rootNode.updateVertical(height);
    this.rightMap.nodes.recursively.setNodeLeft(
      this.rootNode.left,
      this.rootNode.width
    );
  },

  processNodeDropToRight(movedNodeId: string) {
    const movedNode = this.rightMap.removeNode(movedNodeId);
    this.rightMap.nodes.nodes.push(movedNode);

    const newLeft = this.rootNode.width / 2;
    this.rightMap.updateNodesLateral(movedNode, movedNode.width, newLeft);
    this.rightMap.updateNodesVertical(movedNode, movedNode.height);
  },
};

Object.freeze(mindMapDataImpl);

export default MindMapData;
