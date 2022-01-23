import NodeData, { nodeDataImpl } from "~/domain/model/NodeData";
import RightNodesData from "~/domain/model/RightNodesData";
import rightNodesData, {
  rightNodeDataImpl,
} from "~/domain/model/RightNodesData";

interface RootNodeData {
  param: NodeData;
  rightNodesData: RightNodesData;
  leftNodesData: rightNodesData;

  processChangingText(width: number, height: number): void;

  processChangingWidth(width: number): void;

  processChangingHeight(height: number): void;

  updateRightNodesDataLeft(): void;
}

export const newRootNodeData = (
  nodeData: NodeData,
  rightNodesData: RightNodesData,
  leftNodesData: RightNodesData
): RootNodeData => {
  return {
    ...rootNodeData,
    param: nodeData,
    rightNodesData: rightNodesData,
    leftNodesData: rightNodesData,
  };
};

export const rootNodeData: RootNodeData = {
  param: nodeDataImpl,
  rightNodesData: rightNodeDataImpl,
  leftNodesData: rightNodeDataImpl,

  processChangingText(width: number, height: number) {
    this.processChangingWidth(width);
    this.processChangingHeight(height);
    this.updateRightNodesDataLeft();
  },

  processChangingWidth(width: number) {
    this.param.width = width;
    this.param.left = -width / 2;
  },

  processChangingHeight(height: number) {
    this.param.height = height;
    this.param.top = -height / 2;
  },

  updateRightNodesDataLeft() {
    const left = this.param.width / 2;
    this.rightNodesData.list.forEach((nodeData) => (nodeData.left = left));
    this.rightNodesData.list.forEach((nodeData) =>
      nodeData.children.updateNodeLeft(nodeData.left, nodeData.group.width)
    );
  },
};

Object.freeze(rootNodeData);

export default RootNodeData;
