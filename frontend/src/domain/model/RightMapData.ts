import NodeData from "~/domain/model/NodeData";
import Children, { childrenImpl } from "~/domain/model/Children";
import DropPosition from "~/domain/model/DropPosition";
import { total } from "~/util/NumberUtil";

type RightMapData = {
  nodes: Children;

  setTextById(id: string, text: string): void;

  recursivelySetLeft(rootNodeLeft: number, rootNodeWidth: number): void;

  handleTextChanges(id: string, width: number, height: number): void;

  updateNodesLateral(target: NodeData, width: number, left: number): void;

  updateNodesVertical(target: NodeData, height: number): void;

  handleDropNode(id: string, dropPosition: DropPosition): void;

  removeNode(id: string): NodeData | null;

  insertNode(
    target: NodeData,
    dropPosition: DropPosition,
    lowerNode: NodeData
  ): void;

  collapseNodes(id: string): void;
};

export const newRightNodesData = (nodes: Children): RightMapData => {
  return {
    ...rightNodeDataImpl,
    nodes: nodes,
  };
};

export const rightNodeDataImpl: RightMapData = {
  nodes: childrenImpl,

  setTextById(id: string, text: string) {
    const target = this.nodes.recursively.findChildById(id);
    if (!target) {
      throw new Error(`Can not found nodeData by id. id = ${id}`);
    }

    target.text = text;
  },

  recursivelySetLeft(rootNodeLeft: number, rootNodeWidth: number) {
    this.nodes.list.forEach((nodeData) =>
      nodeData.setLeft(rootNodeLeft, rootNodeWidth)
    );
    this.nodes.list.forEach((nodeData) =>
      nodeData.children.recursively.setNodeLeft(nodeData.left, nodeData.width)
    );
  },

  handleTextChanges(id: string, width: number, height: number) {
    const target = this.nodes.recursively.findChildById(id);
    if (!target) {
      throw new Error(`Can not found nodeData by id. id = ${id}`);
    }

    this.updateNodesLateral(target, width, target.left);
    this.updateNodesVertical(target, height);
  },

  updateNodesLateral(target: NodeData, width: number, left: number) {
    target.width = width;
    target.left = left;
    target.children.recursively.setNodeLeft(left, width);
  },

  updateNodesVertical(target: NodeData, height: number) {
    target.height = height;
    this.nodes.recursively.updateGroupAndChildrenHeight();

    const totalOfGroupHeights = total(
      this.nodes.list.map((nodeData) => nodeData.group.height)
    );
    const nodesGroupTop = -totalOfGroupHeights / 2;
    this.nodes.recursively.setGroupTop(0, nodesGroupTop);

    this.nodes.recursively.updateNodeTop();
  },

  handleDropNode(id: string, dropPosition: DropPosition) {
    // TODO Node cannot move to own children
    const lowerNode = this.nodes.recursively.findChildByPosition(dropPosition);
    if (lowerNode === undefined) return;

    const movedNode = this.removeNode(id);
    if (movedNode == null) return;
    this.insertNode(movedNode, dropPosition, lowerNode);

    const newLeft = lowerNode.onTail(dropPosition.left)
      ? lowerNode.left + lowerNode.width
      : lowerNode.left;
    this.updateNodesLateral(movedNode, movedNode.width, newLeft);
    this.updateNodesVertical(movedNode, movedNode.height);
  },

  removeNode(id: string): NodeData | null {
    const children = this.nodes.recursively.findChildrenContainsId(id);
    if (children === undefined) {
      throw new Error(`Can not found children contains id. id = ${id}`);
    }

    return children.removeChild(id);
  },

  insertNode(
    target: NodeData,
    dropPosition: DropPosition,
    lowerNode: NodeData
  ) {
    if (lowerNode.onTail(dropPosition.left)) {
      lowerNode.children.list.push(target);
      return;
    }

    const children = this.nodes.recursively.findChildrenContainsId(
      lowerNode.id
    );
    if (children === undefined) {
      throw new Error(
        `Can not found children contains id. id = ${lowerNode.id}`
      );
    }

    children.insertChild(target, dropPosition.top, lowerNode);
  },

  collapseNodes(id: string) {
    const target = this.nodes.recursively.findChildById(id);
    if (!target) {
      throw new Error(`Can not found nodeData by id. id = ${id}`);
    }

    target.toggleCollapse();
    this.updateNodesVertical(target, target.height);
  },
};

Object.freeze(rightNodeDataImpl);

export default RightMapData;
