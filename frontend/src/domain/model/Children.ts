import Node from "~/domain/model/Node";
import RecursivelyChildren, {
  newRecursivelyChildren,
  recursivelyChildrenImpl,
} from "~/domain/model/RecursivelyChildren";

// Collection of NodeData.
// Define process to be managed as a whole¬.
type Children = {
  // Collection of nodes
  // TODO Can expressed by implementing Array?
  nodes: Node[];

  // total height of children node.
  height: number;

  recursively: RecursivelyChildren;

  findNodeHasGrandChildId(grandChildId: string): Node | undefined;

  findTopNodeOf(childId: string): Node | undefined;

  findBottomNodeOf(childId: string): Node | undefined;

  findHeadNodeOf(childId: string, parentChildren: Children): Node | undefined;

  findTailNodeOf(childId: string): Node | undefined;

  removeChild(id: string): Node;

  insertChild(target: Node, dropTop: number, lowerNode: Node): void;

  setGroupTop(parentChildrenHeight: number, parentGroupTop: number): void;
};

export const newChildren = (nodes: Node[]): Children => {
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

  findNodeHasGrandChildId(grandChildId: string): Node | undefined {
    const childrenIsContainId = (node: Node, id: string): boolean => {
      return node.children.nodes
        .map((grandChild) => grandChild.id)
        .includes(id);
    };

    return this.nodes.find((child) => childrenIsContainId(child, grandChildId));
  },

  findTopNodeOf(childId: string): Node | undefined {
    const baseNodeIndex = this.nodes.findIndex((child) => child.id === childId);
    if (baseNodeIndex === -1) {
      return undefined;
    }

    return baseNodeIndex === 0
      ? this.nodes[this.nodes.length - 1]
      : this.nodes[baseNodeIndex - 1];
  },

  findBottomNodeOf(childId: string): Node | undefined {
    const baseNodeIndex = this.nodes.findIndex((child) => child.id === childId);
    if (baseNodeIndex === -1) {
      return undefined;
    }

    return baseNodeIndex === this.nodes.length - 1
      ? this.nodes[0]
      : this.nodes[baseNodeIndex + 1];
  },

  findHeadNodeOf(childId: string, parentChildren: Children): Node | undefined {
    return parentChildren.nodes.find((parentNodeData) =>
      parentNodeData.children.nodes.find((child) => child.id === childId)
    );
  },

  findTailNodeOf(childId: string): Node | undefined {
    return this.nodes.find((child) => child.id === childId)?.children.nodes[0];
  },

  removeChild(id: string): Node {
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

  insertChild(targetNode: Node, dropTop: number, lowerNode: Node) {
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
