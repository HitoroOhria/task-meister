import Children from "~/domain/model/Children";
import { total } from "~/util/NumberUtil";

interface RecursivelyChildren {
  mirror: Children | null;

  updateGroupAndSelfHeight(): void;

  updateNodeTop(): void;

  setNodeLeft(parentNodeLeft: number, parentNodeWidth: number): void;

  setGroupTop(parentHeight: number, parentGroupTop: number): void;
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

  updateGroupAndSelfHeight() {
    this.mirror!.list.forEach((child) =>
      child.group.updateHeight(child.height, child.children)
    );

    // TODO Return 0 when list is empty?
    this.mirror!.height = total(
      this.mirror!.list.map((child) => child.group.height)
    );
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
};

Object.freeze(recursivelyChildrenImpl);

export default RecursivelyChildren;
