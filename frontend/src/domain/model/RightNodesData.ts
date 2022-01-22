import NodeData from "~/domain/model/NodeData";
import { sum } from "~/util/NumberUtil";

interface RightNodesData {
  list: NodeData[];

  findNodeDataById(id: string): NodeData | null;

  setNodeTextById(id: string, text: string): void;

  processChangingText(id: string, width: number, height: number): void;

  processChangingWidth(target: NodeData, width: number): void;

  processChangingHeight(target: NodeData, height: number): void;

  updateListGroupTop(): void;
}

export const newRightNodesData = (list: NodeData[]): RightNodesData => {
  return {
    ...rightNodeDataImpl,
    list: list,
  };
};

export const rightNodeDataImpl: RightNodesData = {
  list: [],

  findNodeDataById(id: string): NodeData | null {
    for (const nodeData of this.list) {
      const target = nodeData.findNodeDataById(id);

      if (target != null) {
        return target;
      }
    }

    console.error(`Can not find NodeData by id. id = ${id}`);
    return null;
  },

  setNodeTextById(id: string, text: string) {
    const target = this.findNodeDataById(id);
    if (target == null) {
      return;
    }

    target.text = text;
  },

  processChangingText(id: string, width: number, height: number) {
    const target = this.findNodeDataById(id);
    if (target == null) {
      return;
    }

    this.processChangingWidth(target, width);
    this.processChangingHeight(target, height);
  },

  processChangingWidth(target: NodeData, width: number) {
    target.processChangingWidth(width);
  },

  processChangingHeight(target: NodeData, height: number) {
    this.updateListGroupTop();
    target.processChangingHeight(height);
  },

  updateListGroupTop() {
    const heightOfAllNodeData = this.list
      .map((nodeData) => nodeData.groupHeight)
      .reduce(sum, 0);
    const topOfFirstNodeData = -heightOfAllNodeData / 2;
    let cumulativeHeightOfPreNodeData = 0;

    this.list.forEach((nodeData) => {
      nodeData.groupTop = topOfFirstNodeData + cumulativeHeightOfPreNodeData;
      cumulativeHeightOfPreNodeData += nodeData.groupHeight;
    });
  },
};

Object.freeze(rightNodeDataImpl);

export default RightNodesData;
