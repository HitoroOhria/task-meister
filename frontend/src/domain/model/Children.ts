import NodeData from "~/domain/model/NodeData";
import { sum } from "~/util/NumberUtil";

interface Children {
  list: NodeData[];
  height: number;

  findChildById(id: string): NodeData | null;

  updateHeight(): void;

  updateAllChildGroupHeight(): void;

  updateNodeTop(parentNodeHeight: number, parentGroupTop: number): void;

  updateNodeLeft(parentNodeLeft: number, parentGroupWidth: number): void;

  updateGroupTop(parentGroupTop: number): void;
}

export const newChildren = (list: NodeData[]): Children => {
  return {
    ...childrenImpl,
    list: list,
  };
};

export const childrenImpl: Children = {
  list: [],
  // total height of children node
  height: 0,

  findChildById(id: string): NodeData | null {
    for (const child of this.list) {
      const target = child.findNodeDataById(id);

      if (target != null) {
        return target;
      }
    }

    return null;
  },

  // TODO どこからも呼ばれてない？
  // Update children height
  updateHeight() {
    this.updateAllChildGroupHeight();

    this.height = this.list.map((child) => child.group.height).reduce(sum, 0);
  },

  updateAllChildGroupHeight() {
    this.list.forEach((child) =>
      child.group.updateHeight(child.nodeHeight, child.children.height)
    );
  },

  // update node top of children
  updateNodeTop(parentNodeHeight: number, parentGroupTop: number) {
    let distanceFromGroupTopOfChild =
      parentNodeHeight > this.height ? (parentNodeHeight - this.height) / 2 : 0;

    this.list.forEach((child) => {
      child.nodeTop = parentGroupTop + distanceFromGroupTopOfChild;
      distanceFromGroupTopOfChild += child.group.height;
    });
  },

  updateNodeLeft(parentNodeLeft: number, parentGroupWidth: number) {
    this.list.forEach(
      (child) => (child.nodeLeft = parentNodeLeft + parentGroupWidth)
    );
  },

  // 依存
  //  - 子の親の groupTop
  //  - 子の groupHeight
  updateGroupTop(parentGroupTop: number) {
    let totalPreChildGroupTop = 0;
    this.list.forEach((child) => {
      child.group.updateTop(parentGroupTop, totalPreChildGroupTop);
      totalPreChildGroupTop += child.group.height;
    });
  },
};

Object.freeze(childrenImpl);

export default Children;
