import RightMap, { rightMapImpl } from "~/domain/model/RightMap";
import RootNode, { rootNodeImpl } from "~/domain/model/RootNode";
import Node from "~/domain/model/Node";
import OriginPoint from "~/domain/model/OriginPoint";

type MindMapData = {
  // TODO Control readonly, get, set
  isInputting: boolean;
  rootNode: RootNode;
  rightMap: RightMap;
  leftMap: RightMap;

  isFirstLayerNode(id: string): boolean;

  findNodeById(id: string): RootNode | Node | undefined;

  findNodeIsSelected(): RootNode | Node | undefined;

  findHeadNode(id: string): RootNode | Node | undefined;

  deselectNode(): void;

  selectTail(): void;

  updateRootNodePlacement(width: number, height: number): void;

  processNodeDropToRight(movedNodeId: string): void;

  updateRelationshipLine(originPoint: OriginPoint): void;
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

  isFirstLayerNode(id: string): boolean {
    return !!this.rightMap.children.nodes.find((node) => node.id === id);
  },

  findNodeById(id: string): RootNode | Node | undefined {
    if (this.rootNode.id === id) {
      return this.rootNode;
    }

    return this.rightMap.children.recursively.findNodeById(id);
  },

  findNodeIsSelected(): RootNode | Node | undefined {
    if (this.rootNode.isSelected) {
      return this.rootNode;
    }

    return this.rightMap.children.recursively.findNodeIsSelected();
  },

  findHeadNode(id: string): RootNode | Node | undefined {
    if (this.isFirstLayerNode(id)) {
      return this.rootNode;
    }

    return this.rightMap.children.recursively.findHeadNode(id);
  },

  deselectNode() {
    if (this.rootNode.isSelected) {
      this.rootNode.isSelected = false;
      return;
    }

    this.rightMap.children.recursively.deselectNode();
  },

  selectTail() {
    if (!this.rightMap.children.nodes[0]) return;

    this.deselectNode();
    this.rightMap.children.nodes[0].isSelected = true;
  },

  updateRootNodePlacement(width: number, height: number) {
    this.rootNode.updateLateral(width);
    this.rootNode.updateVertical(height);
    this.rightMap.children.recursively.setNodeLeft(
      this.rootNode.left,
      this.rootNode.width
    );
  },

  processNodeDropToRight(movedNodeId: string) {
    const movedNode =
      this.rightMap.children.recursively.removeNodeById(movedNodeId);
    this.rightMap.children.nodes.push(movedNode);

    const newLeft = this.rootNode.width / 2;
    this.rightMap.updateNodesLateral(movedNode, movedNode.width, newLeft);
    this.rightMap.updateNodesVertical(movedNode, movedNode.height);
  },

  updateRelationshipLine(originPoint: OriginPoint) {
    this.rightMap.children.recursively.updateRelationshipLine(originPoint, this.rootNode)
  },
};

Object.freeze(mindMapDataImpl);

export default MindMapData;
