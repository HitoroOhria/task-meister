import NodeData, { nodeDataImpl } from "~/domain/model/NodeData";
import Group, { groupImpl } from "~/domain/model/Group";
import Children, { childrenImpl } from "~/domain/model/Children";

type Node = NodeData & {
  group: Group;
  children: Children;

  updateTop(): void;

  setLeft(parentLeft: number, parentWidth: number): void;

  toggleCollapse(): void;
};

export const newNode = (id: string, text: string, children: Children): Node => {
  return {
    ...nodeImpl,
    id: id,
    text: text,
    children: children,
  };
};

// Data of node to be placed on MindMap.
// NodeData consists of a node and children's nodes.
// Whole group is called a group.
// NodeData is not group, but holds value of group to calculate placement.
export const nodeImpl: Node = {
  ...nodeDataImpl,

  group: groupImpl,

  // children nodes of this node
  children: childrenImpl,

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

  toggleCollapse() {
    this.group.isHidden = !this.group.isHidden;
    this.children.recursively.toggleHidden();
  },
};

Object.freeze(nodeImpl);

export default Node;
