import {pickBiggerNumber, sum} from "~/util/NumberUtil";

// Data of node to be placed on Mindmap.
// NodeData consists of a node and children's nodes.
// Whole group is called a group.
// NodeData is not group, but holds value of group to calculate placement.
class NodeData {
  // an id for identify when updating node
  public readonly id: string;

  // width including margin
  public nodeWidth: number;

  // height including height
  public nodeHeight: number;

  // node top value of style
  public nodeTop: number;

  // node left value of style
  public nodeLeft: number;

  // total width of node and children
  public groupWidth: number;

  // total height of node and children
  public groupHeight: number;

  // group top value of style
  public groupTop: number;

  // group left value of style
  public groupLeft: number;

  // children nodes of this node
  public children: NodeData[];

  // total height of children node
  public childrenHeight: number;

  constructor(id: string, children: NodeData[]) {
    this.id = id;
    this.nodeWidth = 0;
    this.nodeHeight = 0;
    this.nodeTop = 0;
    this.nodeLeft = 0;
    this.groupWidth = 0;
    this.groupHeight = 0;
    this.groupTop = 0;
    this.groupLeft = 0;
    this.children = children;
    this.childrenHeight = 0;
  }

  // Update children height of self
  public updateChildrenHeight() {
    this.children.forEach((nodeData) => nodeData.updateChildrenHeight());

    this.childrenHeight = this.children
      .map((nodeData) => nodeData.groupHeight)
      .reduce(sum, 0);
  }

  // Recursively update group width of self and children
  public recursivelyUpdateGroupWidth() {
    this.children.forEach((nodeData) => nodeData.recursivelyUpdateGroupWidth());
    this.updateGroupWidth();
  }

  // Update group width of self
  public updateGroupWidth() {
    const longestChildWidth = this.children
      .map((nodeData) => nodeData.groupWidth)
      .reduce(pickBiggerNumber, 0);

    this.groupWidth = this.nodeWidth + longestChildWidth;
  }

  // Recursively update group height of self and children.
  public recursivelyUpdateGroupHeight() {
    this.children.forEach((nodeData) =>
      nodeData.recursivelyUpdateGroupHeight()
    );
    this.updateGroupHeight();
  }

  // Update group height of self.
  public updateGroupHeight() {
    this.groupHeight =
      this.nodeHeight > this.childrenHeight
        ? this.nodeHeight
        : this.childrenHeight;
  }

  // Update node top of self
  public updateNodeTop() {
    if (this.nodeHeight > this.childrenHeight) {
      this.nodeTop = this.groupTop;
    } else {
      const distanceFromGroupTop = (this.childrenHeight - this.nodeHeight) / 2;
      this.nodeTop = this.groupTop + distanceFromGroupTop;
    }
  }

  // Recursively update node top of children
  public recursivelyUpdateChildrenNodeTop() {
    this.updateChildrenNodeTop();
    this.children.forEach((nodeData) =>
      nodeData.recursivelyUpdateChildrenNodeTop()
    );
  }

  // update node top of children
  public updateChildrenNodeTop() {
    let distanceFromGroupTopOfChild =
      this.nodeHeight > this.childrenHeight
        ? (this.nodeHeight - this.childrenHeight) / 2
        : 0;

    this.children.forEach((nodeData) => {
      nodeData.nodeTop = this.groupTop + distanceFromGroupTopOfChild;
      distanceFromGroupTopOfChild += nodeData.groupHeight;
    });
  }

  public updateChildrenLeft() {
    // absolute の場合
    this.children.forEach(
      (nodeData) => (nodeData.nodeLeft = this.nodeLeft + this.groupWidth)
    );
  }
}

export default NodeData;
