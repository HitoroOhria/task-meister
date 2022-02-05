import RightMapData from "~/domain/model/RightMapData";
import rightNodesData, { rightNodeDataImpl } from "~/domain/model/RightMapData";
import NodeData, { nodeDataImpl } from "~/domain/model/NodeData";

interface MindMapData {
  rootNodeData: NodeData;
  rightMapData: RightMapData;
  leftMapData: rightNodesData;

  setNodeTextById(id: string, text: string): void;

  handleTextChanges(id: string, width: number, height: number): void;

  handleRootNodeTextChanges(width: number, height: number): void;

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

    this.rightMapData.setTextById(id, text);
  },

  handleTextChanges(id: string, width: number, height: number) {
    if (id === this.rootNodeData.id) {
      this.handleRootNodeTextChanges(width, height);
      return;
    }

    this.rightMapData.handleTextChanges(id, width, height);
  },

  handleRootNodeTextChanges(width: number, height: number) {
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
    this.rightMapData.recursivelySetLeft(
      this.rootNodeData.left,
      this.rootNodeData.width
    );
  },
};

Object.freeze(mindMapDataImpl);

export default MindMapData;
