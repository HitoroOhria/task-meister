import NodeData from "~/domain/model/NodeData";
import Node from "~/domain/model/Node";
import Children from "~/domain/model/Children";
import DropPosition from "~/domain/model/DropPosition";

import { total } from "~/util/NumberUtil";

interface RecursivelyChildren {
  children: Children;

  findNodeById(id: string): Node | undefined;

  findNodeByPosition(position: DropPosition): Node | undefined;

  findHeadNode(id: string): Node | undefined;

  findNodeIsSelected(): Node | undefined;

  findChildrenContainsId(id: string): Children | undefined;

  removeNodeById(id: string): Node;

  updateNodeTop(): void;

  setNodeLeft(parentNodeLeft: number, parentNodeWidth: number): void;

  setGroupTop(parentHeight: number, parentGroupTop: number): void;

  updateGroupAndChildrenHeight(): void;

  toggleHidden(): void;

  deselectNode(): void;

  updateRelationshipLine(parentNode: NodeData): void;
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

  findNodeById(id: string): Node | undefined {
    const child = this.children.nodes.find((child) => child.id === id);
    if (child) {
      return child;
    }

    for (const child of this.children.nodes) {
      const target = child.children.recursively.findNodeById(id);

      if (target) {
        return target;
      }
    }

    return undefined;
  },

  findNodeByPosition(position: DropPosition): Node | undefined {
    const child = this.children.nodes.find((child) => child.onArea(position));
    if (child) {
      return child;
    }

    for (const child of this.children.nodes) {
      const target = child.children.recursively.findNodeByPosition(position);

      if (target) {
        return target;
      }
    }

    return undefined;
  },

  findHeadNode(id: string): Node | undefined {
    const node = this.children.findNodeHasChildId(id);
    if (node !== undefined) {
      return node;
    }

    for (const child of this.children.nodes) {
      const targetNode = child.children.recursively.findHeadNode(id);

      if (targetNode !== undefined) {
        return targetNode;
      }
    }

    return undefined;
  },

  findNodeIsSelected(): Node | undefined {
    const selectedNode = this.children.nodes.find((child) => child.isSelected);
    if (selectedNode) {
      return selectedNode;
    }

    for (const child of this.children.nodes) {
      const foundNode = child.children.recursively.findNodeIsSelected();

      if (foundNode) {
        return foundNode;
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

  removeNodeById(id: string): Node {
    const children = this.children.recursively.findChildrenContainsId(id);
    if (!children) {
      throw new Error(`Can not found children contains id. id = ${id}`);
    }

    return children.removeNode(id);
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

  deselectNode() {
    const selectedNode = this.findNodeIsSelected();
    if (!selectedNode) return;

    selectedNode.isSelected = false;
  },

  updateRelationshipLine(parentNode: NodeData) {
    this.children.nodes.forEach((child) =>
      child.relationshipLine.updatePoints(parentNode, child)
    );
    this.children.nodes.forEach((child) =>
      child.children.recursively.updateRelationshipLine(child)
    );
  },
};

Object.freeze(recursivelyChildrenImpl);

export default RecursivelyChildren;
