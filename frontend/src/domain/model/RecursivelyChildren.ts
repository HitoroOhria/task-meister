import Node from "~/domain/model/Node";
import Children from "~/domain/model/Children";
import DropPosition from "~/domain/model/DropPosition";
import { total } from "~/util/NumberUtil";

interface RecursivelyChildren {
  children: Children;

  findChildById(id: string): Node | undefined;

  findChildByPosition(position: DropPosition): Node | undefined;

  findChildHasGrandChildId(id: string): Node | undefined;

  findChildrenContainsId(id: string): Children | undefined;

  updateNodeTop(): void;

  setNodeLeft(parentNodeLeft: number, parentNodeWidth: number): void;

  setGroupTop(parentHeight: number, parentGroupTop: number): void;

  updateGroupAndChildrenHeight(): void;

  toggleHidden(): void;
}

export const newRecursivelyChildren = (
  children: Children
): RecursivelyChildren => {
  return {
    ...recursivelyChildrenImpl,
    children: children,
  };
};

export const recursivelyChildrenImpl: RecursivelyChildren = {
  // TODO Can implement using spread operator?
  children: {} as Children,

  findChildById(id: string): Node | undefined {
    const child = this.children.nodes.find((child) => child.id === id);
    if (child) {
      return child;
    }

    for (const child of this.children.nodes) {
      const target = child.children.recursively.findChildById(id);

      if (target) {
        return target;
      }
    }

    return undefined;
  },

  findChildByPosition(position: DropPosition): Node | undefined {
    const child = this.children.nodes.find((child) => child.onArea(position));
    if (child) {
      return child;
    }

    for (const child of this.children.nodes) {
      const target = child.children.recursively.findChildByPosition(position);

      if (target) {
        return target;
      }
    }

    return undefined;
  },

  findChildHasGrandChildId(id: string): Node | undefined {
    const nodeData = this.children.findChildHasGrandChildId(id);
    if (nodeData !== undefined) {
      return nodeData;
    }

    for (const child of this.children.nodes) {
      const target = child.children.recursively.findChildHasGrandChildId(id);

      if (target !== undefined) {
        return target;
      }
    }

    return undefined;
  },

  findChildrenContainsId(id: string): Children | undefined {
    const include = this.children.nodes.map((child) => child.id).includes(id);
    if (include) {
      return this.children;
    }

    for (const child of this.children.nodes) {
      const children = child.children.recursively.findChildrenContainsId(id);

      if (children) {
        return children;
      }
    }

    return undefined;
  },

  updateNodeTop() {
    this.children.nodes.forEach((child) => child.updateTop());
    this.children.nodes.forEach((child) =>
      child.children.recursively.updateNodeTop()
    );
  },

  setNodeLeft(parentNodeLeft: number, parentNodeWidth: number) {
    this.children.nodes.forEach((child) =>
      child.setLeft(parentNodeLeft, parentNodeWidth)
    );
    this.children.nodes.forEach((child) =>
      child.children.recursively.setNodeLeft(child.left, child.width)
    );
  },

  setGroupTop(parentHeight: number, parentGroupTop: number) {
    this.children.setGroupTop(parentHeight, parentGroupTop);
    this.children.nodes.forEach((child) =>
      child.children.recursively.setGroupTop(child.height, child.group.top)
    );
  },

  updateGroupAndChildrenHeight() {
    this.children.nodes.forEach((child) =>
      child.group.updateHeight(child.isHidden, child.height, child.children)
    );

    // TODO Return 0 when list is empty?
    this.children.height = total(
      this.children.nodes.map((child) => child.group.height)
    );
  },

  toggleHidden() {
    this.children.nodes.forEach((child) => (child.isHidden = !child.isHidden));
    this.children.nodes.forEach((child) =>
      child.children.recursively.toggleHidden()
    );
  },
};

Object.freeze(recursivelyChildrenImpl);

export default RecursivelyChildren;
