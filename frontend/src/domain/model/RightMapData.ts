import NodeData from "~/domain/model/NodeData";
import { sum, total } from "~/util/NumberUtil";
import Children, { childrenImpl } from "~/domain/model/Children";

interface RightMapData {
  nodes: Children;

  findNodeDataById(id: string): NodeData | null;

  setNodeTextById(id: string, text: string): void;

  processChangingText(id: string, width: number, height: number): void;

  processChangingWidth(target: NodeData, width: number): void;

  processChangingHeight(target: NodeData, height: number): void;

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
    this.processChangingHeight(target, height);
  },

  processChangingWidth(target: NodeData, width: number) {
    target.processChangingWidth(width);
  },

  processChangingHeight(target: NodeData, height: number) {
    // TODO 事前に第1層の Group Height は更新されているか？
    //  - Children の Group Height はどこでセットされるか？
    //    - Children.updateAllChildGroupHeight
    // this.updateListGroupTop();
    // this.nodes.list.forEach((nodeData) =>
    //   nodeData.processVerticalChanging(height)
    // );

    target.height = height;
    this.nodes.newUpdateChildrenHeight();
    this.nodes.updateAllChildGroupHeight();

    const totalGroupHeights = total(
      this.nodes.list.map((nodeData) => nodeData.group.height)
    );
    const nodesGroupTop = -totalGroupHeights / 2;
    this.nodes.updateAllGroupTop(0, nodesGroupTop);
    // this.nodes.newUpdateAllNodeTop()

    // const totalOfNodesGroupHeights = total(
    //   this.nodes.list.map((nodeData) => nodeData.group.height)
    // );
    this.nodes.newUpdateAllNodeTop();
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
