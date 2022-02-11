import Children from "~/domain/model/Children";
import { total } from "~/util/NumberUtil";
import NodeData from "~/domain/model/NodeData";
import DropPosition from "~/domain/model/DropPosition";

interface RecursivelyChildren {
  mirror: Children | null;

  findChildById(id: string): NodeData | undefined;

  findChildByPosition(position: DropPosition): NodeData | undefined;

  findChildHasGrandChildId(id: string): NodeData | undefined;

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
    mirror: children,
  };
};

export const recursivelyChildrenImpl: RecursivelyChildren = {
  // TODO Can implement using spread operator?
  mirror: null,

  findChildById(id: string): NodeData | undefined {
    const child = this.mirror!.list.find((child) => child.id === id);
    if (child) {
      return child;
    }

    for (const child of this.mirror!.list) {
      const target = child.children.recursively.findChildById(id);

      if (target) {
        return target;
      }
    }

    return undefined;
  },

  findChildByPosition(position: DropPosition): NodeData | undefined {
    const child = this.mirror!.list.find((child) => child.onArea(position));
    if (child) {
      return child;
    }

    for (const child of this.mirror!.list) {
      const target = child.children.recursively.findChildByPosition(position);

      if (target) {
        return target;
      }
    }

    return undefined;
  },

  findChildHasGrandChildId(id: string): NodeData | undefined {
    const nodeData = this.mirror!.findChildHasGrandChildId(id);
    if (nodeData !== undefined) {
      return nodeData;
    }

    for (const child of this.mirror!.list) {
      const target = child.children.recursively.findChildHasGrandChildId(id);

      if (target !== undefined) {
        return target;
      }
    }

    return undefined;
  },

  updateNodeTop() {
    this.mirror!.list.forEach((child) => child.updateTop());
    this.mirror!.list.forEach((child) =>
      child.children.recursively.updateNodeTop()
    );
  },

  setNodeLeft(parentNodeLeft: number, parentNodeWidth: number) {
    this.mirror!.list.forEach((child) =>
      child.setLeft(parentNodeLeft, parentNodeWidth)
    );
    this.mirror!.list.forEach((child) =>
      child.children.recursively.setNodeLeft(child.left, child.width)
    );
  },

  setGroupTop(parentHeight: number, parentGroupTop: number) {
    this.mirror!.setGroupTop(parentHeight, parentGroupTop);
    this.mirror!.list.forEach((child) =>
      child.children.recursively.setGroupTop(child.height, child.group.top)
    );
  },

  updateGroupAndChildrenHeight() {
    this.mirror!.list.forEach((child) =>
      child.group.updateHeight(child.isHidden, child.height, child.children)
    );

    // TODO Return 0 when list is empty?
    this.mirror!.height = total(
      this.mirror!.list.map((child) => child.group.height)
    );
  },

  toggleHidden() {
    this.mirror!.list.forEach((child) => (child.isHidden = !child.isHidden));
    this.mirror!.list.forEach((child) =>
      child.children.recursively.toggleHidden()
    );
  },
};

Object.freeze(recursivelyChildrenImpl);

export default RecursivelyChildren;
