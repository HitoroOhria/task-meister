import Group, { groupImpl } from "~/domain/model/Group";
import Children, { childrenImpl } from "~/domain/model/Children";

interface NodeData {
  id: string;
  text: string;
  nodeWidth: number;
  nodeHeight: number;
  nodeTop: number;
  nodeLeft: number;
  group: Group;
  children: Children;

  findNodeDataById(id: string): NodeData | null;

  processChangingWidth(width: number): void;

  processChangingHeight(height: number): void;

  recursivelyUpdateGroupHeightAndChildrenHeight(): void;

  recursivelyUpdateGroupWidth(): void;

  recursivelyUpdateGroupHeight(): void;

  updateNodeTop(): void;

  recursivelyUpdateChildrenNodeTop(): void;

  recursivelyUpdateChildrenGroupTop(): void;
}

export const newNodeData = (
  id: string,
  text: string,
  group: Group,
  children: Children
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
  children: childrenImpl,

  findNodeDataById(id: string): NodeData | null {
    if (this.id === id) {
      return this;
    }

    return this.children.findChildById(id)
  },

  processChangingWidth(width: number) {
    this.nodeWidth = width;
    this.recursivelyUpdateGroupWidth();
    this.children.updateNodeLeft(this.nodeLeft, this.group.width);
  },

  processChangingHeight(height: number) {
    this.nodeHeight = height;
    this.recursivelyUpdateGroupHeightAndChildrenHeight();
    this.recursivelyUpdateChildrenGroupTop();
    this.updateNodeTop();
    this.recursivelyUpdateChildrenNodeTop();
  },

  recursivelyUpdateGroupHeightAndChildrenHeight() {
    this.children.list.forEach((child) =>
      child.group.updateHeight(child.nodeHeight, child.children.height)
    );
    this.group.updateHeight(this.nodeHeight, this.children.height);
  },

  // Recursively update group width of self and children
  recursivelyUpdateGroupWidth() {
    this.children.list.forEach((nodeData) =>
      nodeData.recursivelyUpdateGroupWidth()
    );
    this.group.updateWidth(this.nodeWidth, this.children);
  },

  // Recursively update group height of self and children.
  recursivelyUpdateGroupHeight() {
    this.children.list.forEach((nodeData) =>
      nodeData.recursivelyUpdateGroupHeight()
    );
    this.group.updateHeight(this.nodeHeight, this.children.height);
  },

  // Update node top of self
  updateNodeTop() {
    if (this.nodeHeight > this.children.height) {
      this.nodeTop = this.group.top;
    } else {
      const distanceFromGroupTop = (this.children.height - this.nodeHeight) / 2;
      this.nodeTop = this.group.top + distanceFromGroupTop;
    }
  },

  // Recursively update node top of children
  recursivelyUpdateChildrenNodeTop() {
    this.children.updateNodeTop(this.nodeHeight, this.group.top);
    this.children.list.forEach((child) =>
      child.recursivelyUpdateChildrenNodeTop()
    );
  },

  recursivelyUpdateChildrenGroupTop() {
    this.children.updateGroupTop(this.group.top);
    this.children.list.forEach((child) =>
      child.recursivelyUpdateChildrenGroupTop()
    );
  },
};

Object.freeze(nodeDataImpl);

export default NodeData;
