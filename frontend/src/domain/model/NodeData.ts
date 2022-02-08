import Group, {groupImpl} from "~/domain/model/Group";
import Children, {childrenImpl} from "~/domain/model/Children";
import DropPosition from "~/domain/model/DropPosition";

// Ratio of width representing tail area of node.
const tailAreaRatio = 0.2;

type NodeData = {
  id: string;
  text: string;
  width: number;
  height: number;
  top: number;
  left: number;
  group: Group;
  children: Children;
  isHidden: boolean;

  findByIdFromGroup(id: string): NodeData | null;

  findByPositionFromGroup(position: DropPosition): NodeData | null;

  inXRange(left: number): boolean;

  inYRange(top: number): boolean;

  onUpper(top: number): boolean;

  onTail(left: number): boolean;

  updateTop(): void;

  setLeft(parentLeft: number, parentWidth: number): void;

  toggleChildrenHidden(): void;

  insertChild(target: NodeData): void;
};

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

  isHidden: false,

  findByIdFromGroup(id: string): NodeData | null {
    if (this.id === id) {
      return this;
    }

    return this.children.findChildById(id);
  },

  findByPositionFromGroup(position: DropPosition): NodeData | null {
    if (this.inXRange(position.left) && this.inYRange(position.top)) {
      return this;
    }

    return this.children.findChildByPosition(position);
  },

  // TODO Respond to left map.
  //   - Maybe invert width when left map
  inXRange(left: number): boolean {
    return this.left < left && left < this.left + this.width;
  },

  inYRange(top: number): boolean {
    return this.top < top && top < this.top + this.height;
  },

  onUpper(top: number): boolean {
    const center = this.top + this.height / 2;

    return this.top < top && top < center;
  },

  // TODO Respond to left map.
  //   - Maybe invert width when left map
  onTail(left: number): boolean {
    const border = this.left + this.width * (1 - tailAreaRatio);

    return border < left && left < this.left + this.width;
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

  toggleChildrenHidden() {
    this.children.recursively.toggleHidden();
  },

  insertChild(target: NodeData) {
    this.children.list.push(target);
  },
};

Object.freeze(nodeDataImpl);

export default NodeData;
