import NodeData from "~/domain/model/NodeData";
import { sum } from "~/util/NumberUtil";

interface RightNodesData {
  list: NodeData[];

  findNodeDataById(id: string): NodeData | null;

  setNodeTextById(id: string, text: string): void;

  processChangingText(id: string, width: number, height: number): void;

  processChangingWidth(target: NodeData, width: number): void;

  processChangingHeight(height: number): void;

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
    this.processChangingHeight(height);
  },

  processChangingWidth(target: NodeData, width: number) {
    target.processChangingWidth(width);
  },

  processChangingHeight(height: number) {
    this.updateListGroupTop();
    this.list.forEach((nodeData) => nodeData.processChangingHeight(height));
  },

  updateListGroupTop() {
    const totalHeightOfList = this.list
      .map((nodeData) => nodeData.group.height)
      .reduce(sum, 0);
    const topOfFirstNodeData = -totalHeightOfList / 2;
    let cumulativeHeightOfPreNodeData = 0;

    this.list.forEach((nodeData) => {
      nodeData.group.top = topOfFirstNodeData + cumulativeHeightOfPreNodeData;
      cumulativeHeightOfPreNodeData += nodeData.group.height;
    });
  },
};

Object.freeze(rightNodeDataImpl);

export default RightNodesData;
