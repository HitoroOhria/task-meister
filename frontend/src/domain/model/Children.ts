import NestableNode from "~/domain/model/NestableNode";
import RecursivelyChildren, {
  newRecursivelyChildren,
  recursivelyChildrenImpl,
} from "~/domain/model/RecursivelyChildren";

// Collection of NodeData.
// Define process to be managed as a whole¬.
type Children = {
  // Collection of nodes
  // TODO Can expressed by implementing Array?
  nodes: NestableNode[];

  // total height of children node.
  height: number;

  recursively: RecursivelyChildren;

  findChildHasGrandChildId(grandChildId: string): NestableNode | undefined;

  findTopNodeOf(childId: string): NestableNode | undefined;

  findBottomNodeOf(childId: string): NestableNode | undefined;

  findHeadNodeOf(
    childId: string,
    parentChildren: Children
  ): NestableNode | undefined;

  findTailNodeOf(childId: string): NestableNode | undefined;

  removeChild(id: string): NestableNode;

  insertChild(
    target: NestableNode,
    dropTop: number,
    lowerNode: NestableNode
  ): void;

  setGroupTop(parentChildrenHeight: number, parentGroupTop: number): void;
};

export const newChildren = (nodes: NestableNode[]): Children => {
  const children: Children = {
    ...childrenImpl,
    nodes: nodes,
  };
  children.recursively = newRecursivelyChildren(children);

  return children;
};

export const childrenImpl: Children = {
  nodes: [],
  height: 0,
  recursively: recursivelyChildrenImpl,

  findChildHasGrandChildId(grandChildId: string): NestableNode | undefined {
    return this.nodes.find((child) =>
      child.children.nodes
        .map((grandChild) => grandChild.id)
        .includes(grandChildId)
    );
  },

  findTopNodeOf(childId: string): NestableNode | undefined {
    const baseNodeIndex = this.nodes.findIndex((child) => child.id === childId);
    if (baseNodeIndex === -1) {
      return undefined;
    }

    return baseNodeIndex === 0
      ? this.nodes[this.nodes.length - 1]
      : this.nodes[baseNodeIndex - 1];
  },

  findBottomNodeOf(childId: string): NestableNode | undefined {
    const baseNodeIndex = this.nodes.findIndex((child) => child.id === childId);
    if (baseNodeIndex === -1) {
      return undefined;
    }

    return baseNodeIndex === this.nodes.length - 1
      ? this.nodes[0]
      : this.nodes[baseNodeIndex + 1];
  },

  findHeadNodeOf(
    childId: string,
    parentChildren: Children
  ): NestableNode | undefined {
    return parentChildren.nodes.find((parentNodeData) =>
      parentNodeData.children.nodes.find((child) => child.id === childId)
    );
  },

  findTailNodeOf(childId: string): NestableNode | undefined {
    return this.nodes.find((child) => child.id === childId)?.children.nodes[0];
  },

  removeChild(id: string): NestableNode {
    const removedChild = this.nodes.find((child) => child.id === id);
    const removedChildIndex = this.nodes.findIndex((child) => child.id === id);
    if (!removedChild || removedChildIndex === -1) {
      throw new Error(
        `can not found targetId to remove from children. id = ${id}`
      );
    }

    this.nodes.splice(removedChildIndex, 1);
    return removedChild;
  },

  insertChild(
    targetNode: NestableNode,
    dropTop: number,
    lowerNode: NestableNode
  ) {
    let lowerNodeIndex = this.nodes.findIndex(
      (child) => child.id === lowerNode.id
    );
    if (lowerNodeIndex === -1) {
      throw new Error(`index out of list. index = ${lowerNodeIndex}`);
    }

    !lowerNode.onUpper(dropTop) && lowerNodeIndex++;
    this.nodes.splice(lowerNodeIndex, 0, targetNode);
  },

  setGroupTop(parentChildrenHeight: number, parentGroupTop: number) {
    let fromParentGroupTop =
      this.height < parentChildrenHeight
        ? (parentChildrenHeight - this.height) / 2
        : 0;

    this.nodes.forEach((child) => {
      child.group.setTop(parentGroupTop, fromParentGroupTop);
      fromParentGroupTop += child.group.height;
    });
  },
};

Object.freeze(childrenImpl);

export default Children;
