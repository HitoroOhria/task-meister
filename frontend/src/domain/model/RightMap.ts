import Node from "~/domain/model/Node";
import Children, { childrenImpl } from "~/domain/model/Children";
import DropPosition from "~/domain/model/DropPosition";
import { total } from "~/util/NumberUtil";

type RightMap = {
  children: Children;

  setTextById(id: string, text: string): void;

  updatePlacement(id: string, width: number, height: number): void;

  updateNodesLateral(updatedNode: Node, width: number, left: number): void;

  updateNodesVertical(updatedNode: Node, height: number): void;

  processNodeDrop(movedNodeId: string, dropPosition: DropPosition): void;

  removeNode(id: string): Node;

  insertNode(target: Node, dropPosition: DropPosition, lowerNode: Node): void;

  collapseNodes(selectedId: string): void;
};

export const newRightMap = (nodes: Children): RightMap => {
  return {
    ...rightMapImpl,
    children: nodes,
  };
};

export const rightMapImpl: RightMap = {
  children: childrenImpl,

  setTextById(id: string, text: string) {
    const targetNode = this.children.recursively.findNodeById(id);
    if (!targetNode) {
      throw new Error(`Can not found nodeData by id. id = ${id}`);
    }

    targetNode.text = text;
  },

  updatePlacement(id: string, width: number, height: number) {
    const target = this.children.recursively.findNodeById(id);
    if (!target) {
      throw new Error(`Can not found nodeData by id. id = ${id}`);
    }

    this.updateNodesLateral(target, width, target.left);
    this.updateNodesVertical(target, height);
  },

  updateNodesLateral(updatedNode: Node, width: number, left: number) {
    updatedNode.width = width;
    updatedNode.left = left;
    updatedNode.children.recursively.setNodeLeft(left, width);
  },

  updateNodesVertical(updatedNode: Node, height: number) {
    updatedNode.height = height;
    this.children.recursively.updateGroupAndChildrenHeight();

    const totalOfGroupHeights = total(
      this.children.nodes.map((nodeData) => nodeData.group.height)
    );
    const nodesGroupTop = -totalOfGroupHeights / 2;
    this.children.recursively.setGroupTop(0, nodesGroupTop);

    this.children.recursively.updateNodeTop();
  },

  processNodeDrop(movedNodeId: string, dropPosition: DropPosition) {
    // TODO Node cannot move to own children
    const lowerNode =
      this.children.recursively.findNodeByPosition(dropPosition);
    if (!lowerNode) return;

    const movedNode = this.removeNode(movedNodeId);
    this.insertNode(movedNode, dropPosition, lowerNode);

    const newLeft = lowerNode.onTail(dropPosition.left)
      ? lowerNode.left + lowerNode.width
      : lowerNode.left;
    this.updateNodesLateral(movedNode, movedNode.width, newLeft);
    this.updateNodesVertical(movedNode, movedNode.height);
  },

  removeNode(id: string): Node {
    const children = this.children.recursively.findChildrenContainsId(id);
    if (!children) {
      throw new Error(`Can not found children contains id. id = ${id}`);
    }

    return children.removeNode(id);
  },

  insertNode(target: Node, dropPosition: DropPosition, lowerNode: Node) {
    if (lowerNode.onTail(dropPosition.left)) {
      lowerNode.children.nodes.push(target);
      return;
    }

    const children = this.children.recursively.findChildrenContainsId(
      lowerNode.id
    );
    if (!children) {
      throw new Error(
        `Can not found children contains id. id = ${lowerNode.id}`
      );
    }

    children.insertNode(target, dropPosition.top, lowerNode);
  },

  collapseNodes(selectedId: string) {
    const selectedNode = this.children.recursively.findNodeById(selectedId);
    if (!selectedNode) {
      throw new Error(`Can not found nodeData by id. id = ${selectedId}`);
    }

    selectedNode.toggleCollapse();
    this.updateNodesVertical(selectedNode, selectedNode.height);
  },
};

Object.freeze(rightMapImpl);

export default RightMap;
