import Children from "~/domain/model/Children";

// Total area of node and its children.
// Group has area and location information.
interface Group {
  // total height of node and children.
  height: number;

  // group top value of style.
  top: number;

  updateHeight(nodeHeight: number, children: Children): void;

  setTop(parentGroupTop: number, fromGroupHeight: number): void;
}

export const newGroup = (): Group => {
  return {
    ...groupImpl,
  };
};

export const groupImpl: Group = {
  height: 0,

  top: 0,

  updateHeight(nodeHeight: number, children: Children) {
    children.recursivelyUpdateGroupAndSelfHeight();

    this.height = nodeHeight > children.height ? nodeHeight : children.height;
  },

  setTop(parentGroupTop: number, fromGroupHeight: number) {
    this.top = parentGroupTop + fromGroupHeight;
  },
};

Object.freeze(groupImpl);

export default Group;
