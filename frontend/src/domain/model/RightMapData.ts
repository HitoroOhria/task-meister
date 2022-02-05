import NodeData from "~/domain/model/NodeData";
import Children, { childrenImpl } from "~/domain/model/Children";
import { total } from "~/util/NumberUtil";

interface RightMapData {
  nodes: Children;

  findNodeDataById(id: string): NodeData | null;

  setTextById(id: string, text: string): void;

  recursivelySetLeft(rootNodeLeft: number, rootNodeWidth: number): void;

  handleTextChanges(id: string, width: number, height: number): void;

  handleLateralChanges(target: NodeData, width: number): void;

  handleVerticalChanges(target: NodeData, height: number): void;
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
      nodeData.children.recursivelySetNodeLeft(nodeData.left, nodeData.width)
    );
  },

  handleTextChanges(id: string, width: number, height: number) {
    const target = this.findNodeDataById(id);
    if (target == null) return;

    this.handleLateralChanges(target, width);
    this.handleVerticalChanges(target, height);
  },

  handleLateralChanges(target: NodeData, width: number) {
    target.handleLateralChanges(width);
  },

  handleVerticalChanges(target: NodeData, height: number) {
    target.height = height;
    this.nodes.recursivelyUpdateGroupAndSelfHeight();

    const totalOfGroupHeights = total(
      this.nodes.list.map((nodeData) => nodeData.group.height)
    );
    const nodesGroupTop = -totalOfGroupHeights / 2;
    this.nodes.recursivelySetGroupTop(0, nodesGroupTop);

    this.nodes.recursivelyUpdateNodeTop();
  },
};

Object.freeze(rightNodeDataImpl);

export default RightMapData;
