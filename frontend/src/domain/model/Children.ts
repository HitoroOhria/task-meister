import NodeData from "~/domain/model/NodeData";
import {total} from "~/util/NumberUtil";

// Collection of NodeData.
// Define process to be managed as a whole¬.
interface Children {
  // Collection of nodes
  // TODO Can expressed by implementing Array?
  list: NodeData[];

  // total height of children node.
  height: number;

  // find child by id.
  findChildById(id: string): NodeData | null;

  recursivelyUpdateGroupAndSelfHeight(): void;

  recursivelyUpdateNodeTop(): void;

  // Update node left of all child.
  recursivelySetNodeLeft(
    parentNodeLeft: number,
    parentGroupWidth: number
  ): void;

  recursivelySetGroupTop(parentHeight: number, parentGroupTop: number): void;

  setGroupTop(parentHeight: number, parentGroupTop: number): void;
}

export const newChildren = (list: NodeData[]): Children => {
  return {
    ...childrenImpl,
    list: list,
  };
};

export const childrenImpl: Children = {
  list: [],
  height: 0,

  findChildById(id: string): NodeData | null {
    for (const child of this.list) {
      const target = child.findByIdFromGroup(id);

      if (target != null) {
        return target;
      }
    }

    return null;
  },

  recursivelyUpdateGroupAndSelfHeight() {
    this.list.forEach((child) =>
      child.group.updateHeight(child.height, child.children)
    );

    // TODO Return 0 when list is empty?
    this.height = total(this.list.map((child) => child.group.height));
  },

  recursivelyUpdateNodeTop() {
    this.list.forEach((child) => child.updateTop());
    this.list.forEach((child) => child.children.recursivelyUpdateNodeTop());
  },

  recursivelySetNodeLeft(parentNodeLeft: number, parentNodeWidth: number) {
    this.list.forEach((child) =>
      child.setLeft(parentNodeLeft, parentNodeWidth)
    );
    this.list.forEach((child) =>
      child.children.recursivelySetNodeLeft(child.left, child.width)
    );
  },

  recursivelySetGroupTop(parentHeight, parentGroupTop: number) {
    this.setGroupTop(parentHeight, parentGroupTop);
    this.list.forEach((child) =>
      child.children.recursivelySetGroupTop(child.height, child.group.top)
    );
  },

  setGroupTop(parentHeight: number, parentGroupTop: number) {
    let fromParentGroupTop =
      this.height < parentHeight ? (parentHeight - this.height) / 2 : 0;

    this.list.forEach((child) => {
      child.group.setTop(parentGroupTop, fromParentGroupTop);
      fromParentGroupTop += child.group.height;
    });
  },
};

Object.freeze(childrenImpl);

export default Children;
