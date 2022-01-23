import { sum } from "~/util/NumberUtil";
import Group, { groupImpl } from "~/domain/model/Group";

interface NodeData {
  id: string;
  text: string;
  nodeWidth: number;
  nodeHeight: number;
  nodeTop: number;
  nodeLeft: number;
  group: Group;
  children: NodeData[];
  childrenHeight: number;

  findNodeDataById(id: string): NodeData | null;

  processChangingWidth(width: number): void;

  processChangingHeight(height: number): void;

  recursivelyUpdateGroupHeightAndChildrenHeight(): void;

  updateChildrenHeight(): void;

  recursivelyUpdateGroupWidth(): void;

  recursivelyUpdateGroupHeight(): void;

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
  group: Group,
  children: NodeData[]
): NodeData => {
  return {
    ...nodeDataImpl,
    id: id,
    text: text,
    group: group,
    children: children,
  };
};

// Data of node to be placed on Mindmap.
// NodeData consists of a node and children's nodes.
// Whole group is called a group.
// NodeData is not group, but holds value of group to calculate placement.
export const nodeDataImpl: NodeData = {
  // an id for identify when updating node
  id: "",

  // an text of node
  text: "",

  // width including margin
  nodeWidth: 0,

  // height including height
  nodeHeight: 0,

  // node top value of style
  nodeTop: 0,

  // node left value of style
  nodeLeft: 0,

  group: groupImpl,

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
    this.children.forEach((child) =>
      child.group.updateHeight(child.nodeHeight, child.childrenHeight)
    );
    this.group.updateHeight(this.nodeHeight, this.childrenHeight);
  },

  // Update children height of self
  updateChildrenHeight() {
    this.children.forEach((child) =>
      child.group.updateHeight(child.nodeHeight, child.childrenHeight)
    );

    this.childrenHeight = this.children
      .map((nodeData) => nodeData.group.height)
      .reduce(sum, 0);
  },

  // Recursively update group width of self and children
  recursivelyUpdateGroupWidth() {
    this.children.forEach((nodeData) => nodeData.recursivelyUpdateGroupWidth());
    this.group.updateWidth(this.nodeWidth, this.children);
  },

  // Recursively update group height of self and children.
  recursivelyUpdateGroupHeight() {
    this.children.forEach((nodeData) =>
      nodeData.recursivelyUpdateGroupHeight()
    );
    this.group.updateHeight(this.nodeHeight, this.childrenHeight);
  },

  // Update node top of self
  updateNodeTop() {
    if (this.nodeHeight > this.childrenHeight) {
      this.nodeTop = this.group.top;
    } else {
      const distanceFromGroupTop = (this.childrenHeight - this.nodeHeight) / 2;
      this.nodeTop = this.group.top + distanceFromGroupTop;
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
      nodeData.nodeTop = this.group.top + distanceFromGroupTopOfChild;
      distanceFromGroupTopOfChild += nodeData.group.height;
    });
  },

  updateChildrenLeft() {
    this.children.forEach(
      (nodeData) => (nodeData.nodeLeft = this.nodeLeft + this.group.width)
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
      child.group.updateTop(this.group.top, totalPreChildGroupTop);
      totalPreChildGroupTop += child.group.height;
    });
  },
};

Object.freeze(nodeDataImpl);

export default NodeData;
