import RootNode, { rootNodeImpl } from "~/domain/model/RootNode";
import RightMap, { rightMapImpl } from "~/domain/model/RightMap";
import NodeData from "~/domain/model/NodeData";

type MindMapData = {
  // TODO Control readonly, geet, set
  isInputting: boolean;
  rootNode: RootNode;
  rightMap: RightMap;
  leftMap: RightMap;

  findNodeById(id: string): NodeData | undefined;

  deselectNode(): void;

  selectTail(): void;

  processRootNodeTextChanges(width: number, height: number): void;

  processNodeDropToRight(movedNodeId: string): void;
};

export const newMindMapData = (
  rootNode: RootNode,
  rightMap: RightMap,
  leftMap: RightMap
): MindMapData => {
  return {
    ...mindMapDataImpl,
    rootNode: rootNode,
    rightMap: rightMap,
    leftMap: leftMap,
  };
};

export const mindMapDataImpl: MindMapData = {
  isInputting: false,
  rootNode: rootNodeImpl,
  rightMap: rightMapImpl,
  leftMap: rightMapImpl,

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

  selectTail() {
    if (!this.rightMap.nodes.nodes[0]) return ;

    this.deselectNode()
    this.rightMap.nodes.nodes[0].isSelected = true;
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
