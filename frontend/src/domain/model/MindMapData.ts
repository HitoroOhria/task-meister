import NodeData, { nodeDataImpl } from "~/domain/model/NodeData";
import RightMapData from "~/domain/model/RightMapData";
import rightNodesData, { rightNodeDataImpl } from "~/domain/model/RightMapData";

interface MindMapData {
  rootNodeData: NodeData;
  rightMapData: RightMapData;
  leftMapData: rightNodesData;

  setNodeTextById(id: string, text: string): void;

  processChangingText(id: string, width: number, height: number): void;

  processChangingWidth(width: number): void;

  processChangingHeight(height: number): void;

  updateRightNodesDataLeft(): void;
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
      this.processChangingWidth(width);
      this.processChangingHeight(height);
      this.updateRightNodesDataLeft();

      return;
    }

    this.rightMapData.processChangingText(id, width, height);
  },

  processChangingWidth(width: number) {
    this.rootNodeData.width = width;
    this.rootNodeData.left = -width / 2;
  },

  processChangingHeight(height: number) {
    this.rootNodeData.height = height;
    this.rootNodeData.top = -height / 2;
  },

  updateRightNodesDataLeft() {
    const left = this.rootNodeData.width / 2;
    this.rightMapData.nodes.list.forEach((nodeData) => (nodeData.left = left));
    this.rightMapData.nodes.list.forEach((nodeData) =>
      nodeData.children.updateNodeLeft(nodeData.left, nodeData.group.width)
    );
  },
};

Object.freeze(mindMapDataImpl);

export default MindMapData;
