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

  // Set group top of first layer on right map.
  // Group height of first layer needs to be updated in advance.
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
    // TODO 事前に第1層の Group Height は更新されているか？
    this.updateListGroupTop();
    this.nodes.list.forEach((nodeData) =>
      nodeData.processVerticalChanging(height)
    );
  },

  updateListGroupTop() {
    const totalHeightOfList = this.nodes.list
      .map((nodeData) => nodeData.group.height)
      .reduce(sum, 0);
    const topOfFirstNodeData = -(totalHeightOfList / 2);
    let cumulativeHeightOfPreNodeData = 0;

    this.nodes.list.forEach((nodeData) => {
      nodeData.group.top = topOfFirstNodeData + cumulativeHeightOfPreNodeData;
      cumulativeHeightOfPreNodeData += nodeData.group.height;
    });
  },
};

Object.freeze(rightNodeDataImpl);

export default RightMapData;
