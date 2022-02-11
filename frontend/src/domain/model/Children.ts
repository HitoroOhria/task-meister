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

  recursively: RecursivelyChildren;

  // total height of children node.
  height: number;

  findChildHasGrandChildId(id: string): NodeData | undefined;

  findTopNodeIdOf(id: string): string | undefined;

  findBottomNodeIdOf(id: string): string | undefined;

  findRightNodeIdOf(id: string): string | undefined;

  findLeftNodeIdOf(id: string, parentChildren: Children): string | undefined;

  removeChild(id: string): NodeData | null;

  insertChild(target: NodeData, dropTop: number, lowerNode: NodeData): void;

  setGroupTop(parentHeight: number, parentGroupTop: number): void;
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

  findTopNodeIdOf(id: string): string | undefined {
    const baseNodeIndex = this.list.findIndex((child) => child.id === id);
    if (baseNodeIndex === -1) return undefined;

    return baseNodeIndex === 0
      ? this.list[this.list.length - 1].id
      : this.list[baseNodeIndex - 1].id;
  },

  findBottomNodeIdOf(id: string): string | undefined {
    const baseNodeIndex = this.list.findIndex((child) => child.id === id);
    if (baseNodeIndex === -1) return undefined;

    return baseNodeIndex === this.list.length - 1
      ? this.list[0].id
      : this.list[baseNodeIndex + 1].id;
  },

  findRightNodeIdOf(id: string): string | undefined {
    return this.list.find((child) => child.id === id)?.children.list[0]?.id;
  },

  findLeftNodeIdOf(id: string, parentChildren: Children): string | undefined {
    return parentChildren.list.find((parentNodeData) =>
      parentNodeData.children.list.find((child) => child.id === id)
    )?.id;
  },

  removeChild(id: string): NodeData | null {
    const target = this.list.find((child) => child.id === id);
    const targetIndex = this.list.findIndex((child) => child.id === id);
    if (target === undefined || targetIndex === -1) {
      console.log(
        `can not found targetId to remove from this children. id = ${id}`
      );
      return null;
    }

    this.list.splice(targetIndex, 1);
    return target;
  },

  insertChild(target: NodeData, dropTop: number, lowerNode: NodeData) {
    let index = this.list.findIndex((child) => child.id === lowerNode.id);
    if (index < 0 || this.list.length < index) {
      console.error(`index out of list. index = ${index}`);
      return;
    }

    lowerNode.onUpper(dropTop) || index++;
    this.list.splice(index, 0, target);
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
