import { pickBiggerNumber } from "~/util/NumberUtil";
import Children from "~/domain/model/Children";

interface Group {
  width: number;
  height: number;
  top: number;
  left: number;

  updateWidth(nodeWidth: number, children: Children): void;

  updateHeight(nodeHeight: number, childrenHeight: number): void;

  updateTop(parentGroupTop: number, totalPreGroupHeight: number): void;
}

export const newGroup = (): Group => {
  return {
    ...groupImpl,
  };
};

export const groupImpl: Group = {
  // total width of node and children
  width: 0,
  // total height of node and children
  height: 0,
  // group top value of style
  top: 0,
  // group left value of style
  left: 0,

  // Update group width of self
  updateWidth(nodeWidth: number, children: Children) {
    const longestChildWidth = children.list
      .map((nodeData) => nodeData.group.width)
      .reduce(pickBiggerNumber, 0);

    this.width = nodeWidth + longestChildWidth;
  },

  // Update group height of self.
  updateHeight(nodeHeight: number, childrenHeight: number) {
    this.height = nodeHeight > childrenHeight ? nodeHeight : childrenHeight;
  },

  updateTop(parentGroupTop: number, totalPreGroupHeight: number) {
    this.top = parentGroupTop + totalPreGroupHeight;
  },
};

Object.freeze(groupImpl);

export default Group;
