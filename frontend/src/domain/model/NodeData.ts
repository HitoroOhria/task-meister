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

  findByIdFromGroup(id: string): NodeData | null;

  updateTop(): void;

  setLeft(parentLeft: number, parentWidth: number): void;

  handleLateralChanges(width: number): void;
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

  findByIdFromGroup(id: string): NodeData | null {
    if (this.id === id) {
      return this;
    }

    return this.children.findChildById(id);
  },

  // Update node top of self
  updateTop() {
    const fromGroupTop =
      this.children.height < this.height
        ? 0
        : (this.children.height - this.height) / 2;
    this.top = this.group.top + fromGroupTop;
  },

  setLeft(parentLeft: number, parentWidth: number) {
    this.left = parentLeft + parentWidth;
  },

  handleLateralChanges(width: number) {
    this.width = width;
    this.children.recursivelySetNodeLeft(this.left, this.width);
  },
};

Object.freeze(nodeDataImpl);

export default NodeData;
