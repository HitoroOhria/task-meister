import NodeData, { nodeDataImpl } from "~/domain/model/NodeData";
import RightMapData from "~/domain/model/RightMapData";
import rightNodesData, { rightNodeDataImpl } from "~/domain/model/RightMapData";

interface MindMapData {
  rootNodeData: NodeData;
  rightMapData: RightMapData;
  leftMapData: rightNodesData;

  setNodeTextById(id: string, text: string): void;

  processChangingText(id: string, width: number, height: number): void;

  processChangingRootNodeText(width: number, height: number): void;

  updateRootNodeLateral(width: number): void;

  updateRootNodeVertical(height: number): void;

  updateRightNodesLeft(): void;
}

export const newMindMapData = (
  rootNodeData: NodeData,
  rightNodesData: RightMapData,
  leftNodesData: RightMapData
): MindMapData => {
  return {
    ...mindMapDataImpl,
    rootNodeData: rootNodeData,
    rightMapData: rightNodesData,
    leftMapData: leftNodesData,
  };
};

export const mindMapDataImpl: MindMapData = {
  rootNodeData: nodeDataImpl,
  rightMapData: rightNodeDataImpl,
  leftMapData: rightNodeDataImpl,

  setNodeTextById(id: string, text: string) {
    if (id === this.rootNodeData.id) {
      this.rootNodeData.text = text;
      return;
    }

    this.rightMapData.setNodeTextById(id, text);
  },

  processChangingText(id: string, width: number, height: number) {
    if (id === this.rootNodeData.id) {
      this.processChangingRootNodeText(width, height);
      return;
    }

    this.rightMapData.processChangingText(id, width, height);
  },

  processChangingRootNodeText(width: number, height: number) {
    this.updateRootNodeLateral(width);
    this.updateRootNodeVertical(height);
    this.updateRightNodesLeft();
  },

  updateRootNodeLateral(width: number) {
    this.rootNodeData.width = width;
    this.rootNodeData.left = -width / 2;
  },

  updateRootNodeVertical(height: number) {
    this.rootNodeData.height = height;
    this.rootNodeData.top = -height / 2;
  },

  updateRightNodesLeft() {
    this.rightMapData.nodes.list.forEach((nodeData) =>
      nodeData.updateLeft(this.rootNodeData.left, this.rootNodeData.width)
    );
    this.rightMapData.nodes.list.forEach((nodeData) =>
      nodeData.children.updateNodeLeft(nodeData.left, nodeData.width)
    );
  },
};

Object.freeze(mindMapDataImpl);

export default MindMapData;
