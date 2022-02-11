import NestableNode from "~/domain/model/NestableNode";
import Children, { childrenImpl } from "~/domain/model/Children";
import DropPosition from "~/domain/model/DropPosition";
import { total } from "~/util/NumberUtil";

type RightMap = {
  nodes: Children;

  setTextById(id: string, text: string): void;

  handleTextChanges(id: string, width: number, height: number): void;

  updateNodesLateral(
    updatedNode: NestableNode,
    width: number,
    left: number
  ): void;

  updateNodesVertical(updatedNode: NestableNode, height: number): void;

  handleDropNode(movedNodeId: string, dropPosition: DropPosition): void;

  removeNode(id: string): NestableNode;

  insertNode(
    target: NestableNode,
    dropPosition: DropPosition,
    lowerNode: NestableNode
  ): void;

  collapseNodes(selectedId: string): void;
};

export const newRightMap = (nodes: Children): RightMap => {
  return {
    ...rightMapImpl,
    nodes: nodes,
  };
};

export const rightMapImpl: RightMap = {
  nodes: childrenImpl,

  setTextById(id: string, text: string) {
    const target = this.nodes.recursively.findChildById(id);
    if (!target) {
      throw new Error(`Can not found nodeData by id. id = ${id}`);
    }

    target.text = text;
  },

  handleTextChanges(id: string, width: number, height: number) {
    const target = this.nodes.recursively.findChildById(id);
    if (!target) {
      throw new Error(`Can not found nodeData by id. id = ${id}`);
    }

    this.updateNodesLateral(target, width, target.left);
    this.updateNodesVertical(target, height);
  },

  updateNodesLateral(
    updatedNode: NestableNode,
    width: number,
    left: number
  ) {
    updatedNode.width = width;
    updatedNode.left = left;
    updatedNode.children.recursively.setNodeLeft(left, width);
  },

  updateNodesVertical(updatedNode: NestableNode, height: number) {
    updatedNode.height = height;
    this.nodes.recursively.updateGroupAndChildrenHeight();

    const totalOfGroupHeights = total(
      this.nodes.nodes.map((nodeData) => nodeData.group.height)
    );
    const nodesGroupTop = -totalOfGroupHeights / 2;
    this.nodes.recursively.setGroupTop(0, nodesGroupTop);

    this.nodes.recursively.updateNodeTop();
  },

  handleDropNode(movedNodeId: string, dropPosition: DropPosition) {
    // TODO Node cannot move to own children
    const lowerNode = this.nodes.recursively.findChildByPosition(dropPosition);
    if (!lowerNode) return;

    const movedNode = this.removeNode(movedNodeId);
    this.insertNode(movedNode, dropPosition, lowerNode);

    const newLeft = lowerNode.onTail(dropPosition.left)
      ? lowerNode.left + lowerNode.width
      : lowerNode.left;
    this.updateNodesLateral(movedNode, movedNode.width, newLeft);
    this.updateNodesVertical(movedNode, movedNode.height);
  },

  removeNode(id: string): NestableNode {
    const children = this.nodes.recursively.findChildrenContainsId(id);
    if (!children) {
      throw new Error(`Can not found children contains id. id = ${id}`);
    }

    return children.removeChild(id);
  },

  insertNode(
    target: NestableNode,
    dropPosition: DropPosition,
    lowerNode: NestableNode
  ) {
    if (lowerNode.onTail(dropPosition.left)) {
      lowerNode.children.nodes.push(target);
      return;
    }

    const children = this.nodes.recursively.findChildrenContainsId(
      lowerNode.id
    );
    if (!children) {
      throw new Error(
        `Can not found children contains id. id = ${lowerNode.id}`
      );
    }

    children.insertChild(target, dropPosition.top, lowerNode);
  },

  collapseNodes(selectedId: string) {
    const selectedNode = this.nodes.recursively.findChildById(selectedId);
    if (!selectedNode) {
      throw new Error(`Can not found nodeData by id. id = ${selectedId}`);
    }

    selectedNode.toggleCollapse();
    this.updateNodesVertical(selectedNode, selectedNode.height);
  },
};

Object.freeze(rightMapImpl);

export default RightMap;
