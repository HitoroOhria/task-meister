import NodeData from "~/domain/model/NodeData";
import Children, { childrenImpl } from "~/domain/model/Children";
import { total } from "~/util/NumberUtil";

interface RightMapData {
  nodes: Children;

  findNodeDataById(id: string): NodeData | null;

  setTextById(id: string, text: string): void;

  recursivelySetLeft(rootNodeLeft: number, rootNodeWidth: number): void;

  handleTextChanges(id: string, width: number, height: number): void;

  handleLateralChanges(target: NodeData, width: number, left: number): void;

  handleVerticalChanges(target: NodeData, height: number): void;

  handleDropNode(id: string, top: number, left: number): void;

  removeNode(id: string): NodeData | null;

  insertNode(
    target: NodeData,
    top: number,
    left: number,
    lowerNode: NodeData
  ): void;
}

export const newRightNodesData = (nodes: Children): RightMapData => {
  return {
    ...rightNodeDataImpl,
    nodes: nodes,
  };
};

export const rightNodeDataImpl: RightMapData = {
  nodes: childrenImpl,

  findNodeDataById(id: string): NodeData | null {
    // TODO Can refactor using Children.findById?
    for (const nodeData of this.nodes.list) {
      const target = nodeData.findByIdFromGroup(id);

      if (target != null) {
        return target;
      }
    }

    console.error(`Can not find NodeData by id. id = ${id}`);
    return null;
  },

  setTextById(id: string, text: string) {
    const target = this.findNodeDataById(id);
    if (target == null) return;

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
    const target = this.findNodeDataById(id);
    if (target == null) return;

    this.handleLateralChanges(target, width, target.left);
    this.handleVerticalChanges(target, height);
  },

  handleLateralChanges(target: NodeData, width: number, left: number) {
    target.width = width;
    target.left = left;
    target.children.recursively.setNodeLeft(left, width);
  },

  handleVerticalChanges(target: NodeData, height: number) {
    target.height = height;
    this.nodes.recursively.updateGroupAndSelfHeight();

    const totalOfGroupHeights = total(
      this.nodes.list.map((nodeData) => nodeData.group.height)
    );
    const nodesGroupTop = -totalOfGroupHeights / 2;
    this.nodes.recursively.setGroupTop(0, nodesGroupTop);

    this.nodes.recursively.updateNodeTop();
  },

  handleDropNode(id: string, top: number, left: number) {
    const lowerNode = this.nodes.findChildByPosition(top, left);
    // TODO Node cannot move to own children
    if (lowerNode == null) return;

    const movedNode = this.removeNode(id);
    if (movedNode == null) return;
    this.insertNode(movedNode, top, left, lowerNode);

    const newLeft = lowerNode.onTail(left)
      ? lowerNode.left + lowerNode.width
      : lowerNode.left;
    this.handleLateralChanges(movedNode, movedNode.width, newLeft);
    this.handleVerticalChanges(movedNode, movedNode.height);
  },

  removeNode(id: string): NodeData | null {
    const children = this.nodes.findChildrenContainsId(id);
    if (children == null) {
      console.error(
        `can not found id of target to remove from all children. id = ${id}`
      );
      return null;
    }

    return children.removeChild(id);
  },

  insertNode(target: NodeData, top: number, left: number, lowerNode: NodeData) {
    if (lowerNode.onTail(left)) {
      lowerNode.insertChild(target);
      return;
    }

    const children = this.nodes.findChildrenContainsId(lowerNode.id);
    if (children == null) {
      console.error(
        `can not find NodeData using id to insert. id of lower node = ${lowerNode.id}`
      );
      return;
    }

    children.insertChild(target, top, lowerNode);
  },
};

Object.freeze(rightNodeDataImpl);

export default RightMapData;
