import {pickBiggerNumber} from "~/util/NumberUtil";
import Children from "~/domain/model/Children";

// Total area of node and its children.
// Group has area and location information.
interface Group {
  // total width of node and children.
  width: number;

  // total height of node and children.
  height: number;

  // group top value of style.
  top: number;

  // group left value of style.
  left: number;

  // Update group width of self.
  updateWidth(nodeWidth: number, children: Children): void;

  // Update group height of self.
  updateHeight(nodeHeight: number, childrenHeight: number): void;

  updateTop(parentGroupTop: number, totalPreGroupHeight: number): void;
}

export const newGroup = (): Group => {
  return {
    ...groupImpl,
  };
};

export const groupImpl: Group = {
  width: 0,

  height: 0,

  top: 0,

  left: 0,

  updateWidth(nodeWidth: number, children: Children) {
    const longestChildWidth = children.list
      .map((nodeData) => nodeData.group.width)
      .reduce(pickBiggerNumber, 0);

    this.width = nodeWidth + longestChildWidth;
  },

  updateHeight(nodeHeight: number, childrenHeight: number) {
    this.height = nodeHeight > childrenHeight ? nodeHeight : childrenHeight;
  },

  updateTop(parentGroupTop: number, totalPreGroupHeight: number) {
    this.top = parentGroupTop + totalPreGroupHeight;
  },
};

Object.freeze(groupImpl);

export default Group;
