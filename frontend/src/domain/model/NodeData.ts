import { pickBiggerNumber, sum } from "~/util/NumberUtil";

class NodeData {
  public readonly id: string;
  public nodeWidth: number;
  public nodeHeight: number;
  public nodeTop: number;
  public nodeLeft: number;
  public groupWidth: number;
  public groupHeight: number;
  public groupTop: number;
  public groupLeft: number;
  public children: NodeData[];
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
