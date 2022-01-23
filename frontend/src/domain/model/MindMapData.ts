import NodeData, { nodeDataImpl } from "~/domain/model/NodeData";
import RightNodesData from "~/domain/model/RightNodesData";
import rightNodesData, {
  rightNodeDataImpl,
} from "~/domain/model/RightNodesData";

interface MindMapData {
  rootNodeData: NodeData;
  rightMapData: RightNodesData;
  leftMapData: rightNodesData;

  processChangingText(width: number, height: number): void;

  processChangingWidth(width: number): void;

  processChangingHeight(height: number): void;

  updateRightNodesDataLeft(): void;
}

export const newRootNodeData = (
  nodeData: NodeData,
  rightNodesData: RightNodesData,
  leftNodesData: RightNodesData
): MindMapData => {
  return {
    ...rootNodeData,
    rootNodeData: nodeData,
    rightMapData: rightNodesData,
    leftMapData: rightNodesData,
  };
};

export const rootNodeData: MindMapData = {
  rootNodeData: nodeDataImpl,
  rightMapData: rightNodeDataImpl,
  leftMapData: rightNodeDataImpl,

  processChangingText(width: number, height: number) {
    this.processChangingWidth(width);
    this.processChangingHeight(height);
    this.updateRightNodesDataLeft();
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
    this.rightMapData.list.forEach((nodeData) => (nodeData.left = left));
    this.rightMapData.list.forEach((nodeData) =>
      nodeData.children.updateNodeLeft(nodeData.left, nodeData.group.width)
    );
  },
};

Object.freeze(rootNodeData);

export default MindMapData;
