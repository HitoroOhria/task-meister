import { pickBiggerNumber, sum } from "~/util/NumberUtil";

class NodeData {
  private readonly id: string;

  public nodeWidth: number;
  public nodeHeight: number;
  public children: NodeData[];

  // Only getter, no setter
  private mTop: number;
  private mLeft: number;
  private mGroupWidth: number;
  private mGroupHeight: number;

  constructor(id: string, children: NodeData[]) {
    this.id = id;
    this.nodeWidth = 0;
    this.nodeHeight = 0;
    this.children = children;

    // Only getter, no setter
    this.mTop = 0;
    this.mLeft = 0;
    this.mGroupWidth = 0;
    this.mGroupHeight = 0;
  }

  // top is relative top from origin of Mindmap
  get top() {
    return this.mTop;
  }

  // left is relative left from origin of Mindmap
  get left() {
    return this.mLeft;
  }

  // groupWidth is sum width of node and children
  get groupWidth() {
    return this.mGroupWidth;
  }

  // groupHeight is sum height of node and children
  get groupHeight() {
    return this.mGroupHeight;
  }

  public updateGroupWidth() {
    this.children.forEach((nodeData) => nodeData.updateGroupWidth());
    const longestChildWidth = this.children
      .map((nodeData) => nodeData.mGroupWidth)
      .reduce(pickBiggerNumber, 0);

    this.mGroupWidth = this.nodeWidth + longestChildWidth;
  }

  public updateGroupHeight() {
    this.children.forEach((nodeData) => nodeData.updateGroupHeight());
    const childrenHeight = this.children
      .map((nodeData) => nodeData.mGroupHeight)
      .reduce(sum, 0);

    this.mGroupHeight =
      this.nodeHeight > childrenHeight ? this.nodeHeight : childrenHeight;
  }

  public setTopFromRootNode(top: number) {
    this.mTop = top;
  }

  public updateChildrenTop() {
    let cumulativeHeightOfPreNodeData = 0;
    this.children.forEach((nodeData) => {
      nodeData.mTop = this.mTop + cumulativeHeightOfPreNodeData;
      cumulativeHeightOfPreNodeData += nodeData.groupHeight;
    });
  }
}

export default NodeData;
