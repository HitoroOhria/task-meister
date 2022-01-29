import NodeData from "~/domain/model/NodeData";
import { sum } from "~/util/NumberUtil";
import Children, { childrenImpl } from "~/domain/model/Children";

interface RightMapData {
  nodes: Children;

  findNodeDataById(id: string): NodeData | null;

  setNodeTextById(id: string, text: string): void;

  processChangingText(id: string, width: number, height: number): void;

  processChangingWidth(target: NodeData, width: number): void;

  processChangingHeight(height: number): void;

  updateListGroupTop(): void;
}

export const newRightNodesData = (nodes: Children): RightMapData => {
  return {
    ...rightNodeDataImpl,
    nodes: nodes,
  };
};

export const rightNodeDataImpl: RightMapData = {
  nodes: childrenImpl,

  findNodeDataById(id: string): NodeData | null {
    for (const nodeData of this.nodes.list) {
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
    if (target == null) return;

    target.text = text;
  },

  processChangingText(id: string, width: number, height: number) {
    const target = this.findNodeDataById(id);
    if (target == null) return;

    this.processChangingWidth(target, width);
    this.processChangingHeight(height);
  },

  processChangingWidth(target: NodeData, width: number) {
    target.processChangingWidth(width);
  },

  processChangingHeight(height: number) {
    this.updateListGroupTop();
    this.nodes.list.forEach((nodeData) =>
      nodeData.processChangingHeight(height)
    );
  },

  updateListGroupTop() {
    const totalHeightOfList = this.nodes.list
      .map((nodeData) => nodeData.group.height)
      .reduce(sum, 0);
    const topOfFirstNodeData = -totalHeightOfList / 2;
    let cumulativeHeightOfPreNodeData = 0;

    this.nodes.list.forEach((nodeData) => {
      nodeData.group.top = topOfFirstNodeData + cumulativeHeightOfPreNodeData;
      cumulativeHeightOfPreNodeData += nodeData.group.height;
    });
  },
};

Object.freeze(rightNodeDataImpl);

export default RightMapData;
