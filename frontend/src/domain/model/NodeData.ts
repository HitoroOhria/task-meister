import { pickBiggerNumber, sum } from "~/util/NumberUtil";

class NodeData {
  private readonly id: string;
  public nodeWidth: number;
  public nodeHeight: number;
  private mGroupWidth: number;
  private mGroupHeight: number;
  public children: NodeData[];

  constructor(id: string, children: NodeData[]) {
    this.id = id;
    this.nodeWidth = 0;
    this.nodeHeight = 0;
    this.mGroupWidth = 0;
    this.mGroupHeight = 0;
    this.children = children;
  }

  get groupWidth() {
    return this.mGroupWidth;
  }

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
}

export default NodeData;
