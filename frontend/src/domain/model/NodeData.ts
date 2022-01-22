import { pickBiggerNumber, sum } from "~/util/NumberUtil";

interface NodeData {
  id: string;
  text: string;
  nodeWidth: number;
  nodeHeight: number;
  nodeTop: number;
  nodeLeft: number;
  groupWidth: number;
  groupHeight: number;
  groupTop: number;
  groupLeft: number;
  children: NodeData[];
  childrenHeight: number;

  findNodeDataById(id: string): NodeData | null;

  processChangingWidth(width: number): void;

  processChangingHeight(height: number): void;

  recursivelyUpdateGroupHeightAndChildrenHeight(): void;

  updateChildrenHeight(): void;

  recursivelyUpdateGroupWidth(): void;

  updateGroupWidth(): void;

  recursivelyUpdateGroupHeight(): void;

  updateGroupHeight(): void;

  updateNodeTop(): void;

  recursivelyUpdateChildrenNodeTop(): void;

  updateChildrenNodeTop(): void;

  updateChildrenLeft(): void;

  recursivelyUpdateChildrenGroupTop(): void;

  updateChildrenGroupTop(): void;
}

export const newNodeData = (
  id: string,
  text: string,
  children: NodeData[]
): NodeData => {
  return {
    ...nodeData,
    id: id,
    text: text,
    children: children,
  };
};

// Data of node to be placed on Mindmap.
// NodeData consists of a node and children's nodes.
// Whole group is called a group.
// NodeData is not group, but holds value of group to calculate placement.
export const nodeData: NodeData = {
  // an id for identify when updating node
  id: "",

  // an text fo node
  text: "",

  // width including margin
  nodeWidth: 0,

  // height including height
  nodeHeight: 0,

  // node top value of style
  nodeTop: 0,

  // node left value of style
  nodeLeft: 0,

  // total width of node and children
  groupWidth: 0,

  // total height of node and children
  groupHeight: 0,

  // group top value of style
  groupTop: 0,

  // group left value of style
  groupLeft: 0,

  // children nodes of this node
  children: [],

  // total height of children node
  childrenHeight: 0,

  findNodeDataById(id: string): NodeData | null {
    if (this.id === id) {
      return this;
    }

    for (const child of this.children) {
      const target = child.findNodeDataById(id);

      if (target !== null) {
        return target;
      }
    }

    return null;
  },

  processChangingWidth(width: number) {
    this.nodeWidth = width;
    this.recursivelyUpdateGroupWidth();
    this.updateChildrenLeft();
  },

  processChangingHeight(height: number) {
    this.nodeHeight = height;
    this.recursivelyUpdateGroupHeightAndChildrenHeight();
    this.recursivelyUpdateChildrenGroupTop();
    this.updateNodeTop();
    this.recursivelyUpdateChildrenNodeTop();
  },

  recursivelyUpdateGroupHeightAndChildrenHeight() {
    this.children.forEach((child) => child.updateGroupHeight());
    this.updateGroupHeight();
  },

  // Update children height of self
  updateChildrenHeight() {
    this.children.forEach((child) => child.updateGroupHeight());

    this.childrenHeight = this.children
      .map((nodeData) => nodeData.groupHeight)
      .reduce(sum, 0);
  },

  // Recursively update group width of self and children
  recursivelyUpdateGroupWidth() {
    this.children.forEach((nodeData) => nodeData.recursivelyUpdateGroupWidth());
    this.updateGroupWidth();
  },

  // Update group width of self
  updateGroupWidth() {
    const longestChildWidth = this.children
      .map((nodeData) => nodeData.groupWidth)
      .reduce(pickBiggerNumber, 0);

    this.groupWidth = this.nodeWidth + longestChildWidth;
  },

  // Recursively update group height of self and children.
  recursivelyUpdateGroupHeight() {
    this.children.forEach((nodeData) =>
      nodeData.recursivelyUpdateGroupHeight()
    );
    this.updateGroupHeight();
  },

  // Update group height of self.
  updateGroupHeight() {
    this.updateChildrenHeight();

    this.groupHeight =
      this.nodeHeight > this.childrenHeight
        ? this.nodeHeight
        : this.childrenHeight;
  },

  // Update node top of self
  updateNodeTop() {
    if (this.nodeHeight > this.childrenHeight) {
      this.nodeTop = this.groupTop;
    } else {
      const distanceFromGroupTop = (this.childrenHeight - this.nodeHeight) / 2;
      this.nodeTop = this.groupTop + distanceFromGroupTop;
    }
  },

  // Recursively update node top of children
  recursivelyUpdateChildrenNodeTop() {
    this.updateChildrenNodeTop();
    this.children.forEach((nodeData) =>
      nodeData.recursivelyUpdateChildrenNodeTop()
    );
  },

  // update node top of children
  updateChildrenNodeTop() {
    let distanceFromGroupTopOfChild =
      this.nodeHeight > this.childrenHeight
        ? (this.nodeHeight - this.childrenHeight) / 2
        : 0;

    this.children.forEach((nodeData) => {
      nodeData.nodeTop = this.groupTop + distanceFromGroupTopOfChild;
      distanceFromGroupTopOfChild += nodeData.groupHeight;
    });
  },

  updateChildrenLeft() {
    this.children.forEach(
      (nodeData) => (nodeData.nodeLeft = this.nodeLeft + this.groupWidth)
    );
  },

  recursivelyUpdateChildrenGroupTop() {
    this.updateChildrenGroupTop();
    this.children.forEach((child) => child.recursivelyUpdateChildrenGroupTop());
  },

  // 依存
  //  - 子の親の groupTop
  //  - 子の groupHeight
  updateChildrenGroupTop() {
    let totalPreChildGroupTop = 0;
    this.children.forEach((child) => {
      child.groupTop = this.groupTop + totalPreChildGroupTop;
      totalPreChildGroupTop += child.groupHeight;
    });
  },
};

Object.freeze(nodeData)

export default NodeData;
