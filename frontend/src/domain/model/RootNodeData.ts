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
    this.param.nodeWidth = width;
    this.param.nodeLeft = -width / 2;
  },

  processChangingHeight(height: number) {
    this.param.nodeHeight = height;
    this.param.nodeTop = -height / 2;
  },

  updateRightNodesDataLeft() {
    const left = this.param.nodeWidth / 2;
    this.rightNodesData.list.forEach((nodeData) => (nodeData.nodeLeft = left));
    this.rightNodesData.list.forEach((nodeData) =>
      nodeData.updateChildrenLeft()
    );
  },
};

Object.freeze(rootNodeData);

export default RootNodeData;
