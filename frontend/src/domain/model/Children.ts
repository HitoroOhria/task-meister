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

  newUpdateChildrenHeight(): void;

  // Update group height of all child.
  // Following need to be updated in advance.
  //   - height of child
  //   - children height of child
  updateAllChildGroupHeight(): void;

  // Update node top of all child..
  updateNodeTop(parentNodeHeight: number, parentGroupTop: number): void;

  newUpdateAllNodeTop(): void;

  newUpdateNodeTop(parentHeight: number, parentTop: number): void;

  // Update node left of all child.
  updateNodeLeft(parentNodeLeft: number, parentGroupWidth: number): void;

  updateAllGroupTop(parentHeight: number, parentGroupTop: number): void;

  // Update group top left of all child
  // Group height of child needs to be updated in advance.
  updateGroupTop(parentGroupTop: number): void;

  newUpdateGroupTop(parentHeight: number, parentGroupTop: number): void;
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
    // TODO 以下は更新されているか？
    //   - child の高さは更新されているか？
    //   - child の children height は更新されているか？
    this.updateAllChildGroupHeight();

    this.height = this.list.map((child) => child.group.height).reduce(sum, 0);
  },

  newUpdateChildrenHeight() {
    this.list.forEach((child) =>
      child.group.newUpdateHeight(child.height, child.children)
    );

    // TODO Return 0 when list is empty?
    this.height = this.list
      .map((child) => child.group.height)
      .reduce(
        (preGroupHeight, curGroupHeight) => sum(preGroupHeight, curGroupHeight),
        0
      );
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

  newUpdateAllNodeTop() {
    this.list.forEach((child) => child.updateTop());
    this.list.forEach((child) => child.children.newUpdateAllNodeTop());

    // this.newUpdateNodeTop(parentHeight, parentTop);
    // this.list.forEach((child) =>
    //   child.children.newUpdateAllNodeTop(child.height, child.top)
    // );
  },

  newUpdateNodeTop(parentHeight: number, parentTop: number) {
    let heightOfParentGroupTop =
      this.height < parentHeight ? (parentHeight - this.height) / 2 : 0;
    this.list.forEach((child) => {
      child.top = parentTop + heightOfParentGroupTop;
      heightOfParentGroupTop = child.height;
    });
  },

  updateNodeLeft(parentNodeLeft: number, parentNodeWidth: number) {
    this.list.forEach((child) =>
      child.updateLeft(parentNodeLeft, parentNodeWidth)
    );
    this.list.forEach((child) =>
      child.children.updateNodeLeft(child.left, child.width)
    );
  },

  updateAllGroupTop(parentHeight, parentGroupTop: number) {
    // this.updateGroupTop(parentGroupTop);
    // this.list.forEach((child) =>
    //   child.children.updateAllGroupTop(child.group.top)
    // );

    this.newUpdateGroupTop(parentHeight, parentGroupTop);
    this.list.forEach((child) =>
      child.children.updateAllGroupTop(child.height, child.group.top)
    );
  },

  updateGroupTop(parentGroupTop: number) {
    let totalPreChildGroupTop = 0;
    this.list.forEach((child) => {
      child.group.updateTop(parentGroupTop, totalPreChildGroupTop);
      totalPreChildGroupTop += child.group.height;
    });
  },

  newUpdateGroupTop(parentHeight: number, parentGroupTop: number) {
    if (this.height < parentHeight) {
      let heightFromParentGroupTop = (parentHeight - this.height) / 2;
      this.list.forEach((child) => {
        child.group.top = parentGroupTop + heightFromParentGroupTop;
        // const log = `id: ${child.id} parentGroupTop: ${parentGroupTop} heightFromParentGroupTop: ${heightFromParentGroupTop} groupTop: ${child.group.top}`
        // child.id === "id1-1 of right" && console.log(log)
        heightFromParentGroupTop += child.group.height;
      });
      return
    }

    let totalPreChildGroupTop = 0;
    this.list.forEach((child) => {
      child.group.updateTop(parentGroupTop, totalPreChildGroupTop);
      totalPreChildGroupTop += child.group.height;
    });
  },
};

Object.freeze(childrenImpl);

export default Children;
