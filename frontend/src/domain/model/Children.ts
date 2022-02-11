import NodeData from "~/domain/model/NodeData";
import RecursivelyChildren, {
  newRecursivelyChildren,
  recursivelyChildrenImpl,
} from "~/domain/model/RecursivelyChildren";

// Collection of NodeData.
// Define process to be managed as a whole¬.
type Children = {
  // Collection of nodes
  // TODO Can expressed by implementing Array?
  list: NodeData[];

  // total height of children node.
  height: number;

  recursively: RecursivelyChildren;

  findChildHasGrandChildId(id: string): NodeData | undefined;

  findTopNodeOf(childId: string): NodeData | undefined;

  findBottomNodeOf(childId: string): NodeData | undefined;

  findHeadNodeOf(
    childId: string,
    parentChildren: Children
  ): NodeData | undefined;

  findTailNodeOf(childId: string): NodeData | undefined;

  removeChild(id: string): NodeData | null;

  insertChild(target: NodeData, dropTop: number, lowerNode: NodeData): void;

  setGroupTop(parentChildrenHeight: number, parentGroupTop: number): void;
};

export const newChildren = (list: NodeData[]): Children => {
  const children: Children = {
    ...childrenImpl,
    list: list,
  };
  children.recursively = newRecursivelyChildren(children);

  return children;
};

export const childrenImpl: Children = {
  list: [],
  height: 0,
  recursively: recursivelyChildrenImpl,

  findChildHasGrandChildId(id: string): NodeData | undefined {
    return this.list.find((child) =>
      child.children.list.map((grandChild) => grandChild.id).includes(id)
    );
  },

  findTopNodeOf(childId: string): NodeData | undefined {
    const baseNodeIndex = this.list.findIndex((child) => child.id === childId);
    if (baseNodeIndex === -1) {
      return undefined;
    }

    return baseNodeIndex === 0
      ? this.list[this.list.length - 1]
      : this.list[baseNodeIndex - 1];
  },

  findBottomNodeOf(childId: string): NodeData | undefined {
    const baseNodeIndex = this.list.findIndex((child) => child.id === childId);
    if (baseNodeIndex === -1) {
      return undefined;
    }

    return baseNodeIndex === this.list.length - 1
      ? this.list[0]
      : this.list[baseNodeIndex + 1];
  },

  findHeadNodeOf(
    childId: string,
    parentChildren: Children
  ): NodeData | undefined {
    return parentChildren.list.find((parentNodeData) =>
      parentNodeData.children.list.find((child) => child.id === childId)
    );
  },

  findTailNodeOf(childId: string): NodeData | undefined {
    return this.list.find((child) => child.id === childId)?.children.list[0];
  },

  removeChild(id: string): NodeData | null {
    const removedChild = this.list.find((child) => child.id === id);
    const removedChildIndex = this.list.findIndex((child) => child.id === id);
    if (removedChild === undefined || removedChildIndex === -1) {
      throw new Error(
        `can not found targetId to remove from children. id = ${id}`
      );
    }

    this.list.splice(removedChildIndex, 1);
    return removedChild;
  },

  insertChild(targetNode: NodeData, dropTop: number, lowerNode: NodeData) {
    let lowerNodeIndex = this.list.findIndex(
      (child) => child.id === lowerNode.id
    );
    if (lowerNodeIndex === -1) {
      throw new Error(`index out of list. index = ${lowerNodeIndex}`);
    }

    !lowerNode.onUpper(dropTop) && lowerNodeIndex++;
    this.list.splice(lowerNodeIndex, 0, targetNode);
  },

  setGroupTop(parentChildrenHeight: number, parentGroupTop: number) {
    let fromParentGroupTop =
      this.height < parentChildrenHeight
        ? (parentChildrenHeight - this.height) / 2
        : 0;

    this.list.forEach((child) => {
      child.group.setTop(parentGroupTop, fromParentGroupTop);
      fromParentGroupTop += child.group.height;
    });
  },
};

Object.freeze(childrenImpl);

export default Children;
