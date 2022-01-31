import NodeData from "~/domain/model/NodeData";
import {sum} from "~/util/NumberUtil";

// Collection of NodeData.
// Define process to be managed as a whole¬.
interface Children {
  // Collection of nodes
  // TODO Can expressed by implementing Array?
  list: NodeData[];

  // total height of children node.
  height: number;

  // find child by id.
  findChildById(id: string): NodeData | null;

  // Update height of self.
  // Height of child needs to be updated in advance.
  updateChildrenHeight(): void;

  // Update group height of all child.
  // Following need to be updated in advance.
  //   - height of child
  //   - children height of child
  updateAllChildGroupHeight(): void;

  // Update node top of all child..
  updateNodeTop(parentNodeHeight: number, parentGroupTop: number): void;

  // Update node left of all child.
  updateNodeLeft(parentNodeLeft: number, parentGroupWidth: number): void;

  // Update group top left of all child
  // Group height of child needs to be updated in advance..
  updateGroupTop(parentGroupTop: number): void;
}

export const newChildren = (list: NodeData[]): Children => {
  return {
    ...childrenImpl,
    list: list,
  };
};

export const childrenImpl: Children = {
  list: [],
  height: 0,

  findChildById(id: string): NodeData | null {
    for (const child of this.list) {
      const target = child.findNodeDataById(id);

      if (target != null) {
        return target;
      }
    }

    return null;
  },

  // TODO どこからも呼ばれてない？
  updateChildrenHeight() {
    this.updateAllChildGroupHeight();

    this.height = this.list.map((child) => child.group.height).reduce(sum, 0);
  },

  updateAllChildGroupHeight() {
    this.list.forEach((child) =>
      child.group.updateHeight(child.height, child.children.height)
    );
  },

  updateNodeTop(parentNodeHeight: number, parentGroupTop: number) {
    let distanceFromGroupTopOfChild =
      parentNodeHeight > this.height ? (parentNodeHeight - this.height) / 2 : 0;

    this.list.forEach((child) => {
      child.top = parentGroupTop + distanceFromGroupTopOfChild;
      distanceFromGroupTopOfChild += child.group.height;
    });
  },

  updateNodeLeft(parentNodeLeft: number, parentGroupWidth: number) {
    this.list.forEach(
      (child) => (child.left = parentNodeLeft + parentGroupWidth)
    );
  },

  updateGroupTop(parentGroupTop: number) {
    let totalPreChildGroupTop = 0;
    this.list.forEach((child) => {
      child.group.updateTop(parentGroupTop, totalPreChildGroupTop);
      totalPreChildGroupTop += child.group.height;
    });
  },
};

Object.freeze(childrenImpl);

export default Children;
