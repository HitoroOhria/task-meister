import Group, { groupImpl } from "~/domain/model/Group";
import Children, { childrenImpl } from "~/domain/model/Children";

interface NodeData {
  id: string;
  text: string;
  width: number;
  height: number;
  top: number;
  left: number;
  group: Group;
  children: Children;

  findNodeDataById(id: string): NodeData | null;

  updateTop(): void;

  updateLeft(parentLeft: number, parentWidth: number): void;

  processChangingWidth(width: number): void;

  processVerticalChanging(height: number): void;

  recursivelyUpdateChildrenGroupHeightAndSelf(): void;

  recursivelyUpdateGroupWidth(): void;

  recursivelyUpdateGroupHeight(): void;

  recursivelyUpdateChildrenNodeTop(): void;

  newUpdateNodeTop(parentHeight: number): void;

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

// Data of node to be placed on MindMap.
// NodeData consists of a node and children's nodes.
// Whole group is called a group.
// NodeData is not group, but holds value of group to calculate placement.
export const nodeDataImpl: NodeData = {
  // an id for identify when updating node
  id: "",

  // an text of node
  text: "",

  // width including margin
  width: 0,

  // height including height
  height: 0,

  // node top value of style
  top: 0,

  // node left value of style
  left: 0,

  group: groupImpl,

  // children nodes of this node
  children: childrenImpl,

  findNodeDataById(id: string): NodeData | null {
    if (this.id === id) {
      return this;
    }

    return this.children.findChildById(id);
  },

  // Update node top of self
  updateTop() {
    if (this.children.height < this.height) {
      this.top = this.group.top;
      return;
    }

    const distanceFromGroupTop = (this.children.height - this.height) / 2;
    this.top = this.group.top + distanceFromGroupTop;
  },

  updateLeft(parentLeft: number, parentWidth: number) {
    this.left = parentLeft + parentWidth;
  },

  processChangingWidth(width: number) {
    this.width = width;
    // TODO 以下を更新する必要はないのでは？
    // this.recursivelyUpdateGroupWidth();
    this.children.updateNodeLeft(this.left, this.width);
  },

  //
  processVerticalChanging(height: number) {
    this.height = height;
    this.recursivelyUpdateChildrenGroupHeightAndSelf();
    this.recursivelyUpdateChildrenGroupTop();
    this.updateTop();
    this.recursivelyUpdateChildrenNodeTop();
  },

  recursivelyUpdateChildrenGroupHeightAndSelf() {
    this.children.list.forEach((child) =>
      child.group.updateHeight(child.height, child.children.height)
    );
    this.children.updateChildrenHeight();
    this.group.updateHeight(this.height, this.children.height);
  },

  // Recursively update group width of self and children
  recursivelyUpdateGroupWidth() {
    this.children.list.forEach((nodeData) =>
      nodeData.recursivelyUpdateGroupWidth()
    );
    this.group.updateWidth(this.width, this.children);
  },

  // Recursively update group height of self and children.
  recursivelyUpdateGroupHeight() {
    this.children.list.forEach((nodeData) =>
      nodeData.recursivelyUpdateGroupHeight()
    );
    this.group.updateHeight(this.height, this.children.height);
  },

  // Recursively update node top of children
  recursivelyUpdateChildrenNodeTop() {
    this.children.updateNodeTop(this.height, this.group.top);
    this.children.list.forEach((child) =>
      child.recursivelyUpdateChildrenNodeTop()
    );
  },

  newUpdateNodeTop(parentHeight: number) {
    if (this.group.height < parentHeight) {
      this.top = parentHeight - this.height;
    }

    const distanceFromGroupTop =
      this.height < this.children.height
        ? (this.children.height - this.height) / 2
        : 0;

    this.top = this.group.top + distanceFromGroupTop;
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
