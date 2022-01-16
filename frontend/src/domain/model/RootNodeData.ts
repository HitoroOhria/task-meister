import NodeData from "~/domain/model/NodeData";

class RootNodeData {
  public rightNodesData: NodeData[];
  public leftNodesData: NodeData[];

  constructor(rightNodesData: NodeData[], leftNodesData: NodeData[]) {
    this.rightNodesData = rightNodesData;
    this.leftNodesData = leftNodesData;
  }

  public updateRightNodeDataGroupHeight() {
    this.rightNodesData.forEach((nodeData) => nodeData.updateGroupHeight());
  }

  public updateRightNodesDataTop() {
    const heightOfAllNodeData = this.rightNodesData
      .map((nodeData) => nodeData.groupHeight)
      .reduce(sum, 0);
    const topOfFirstNodeData = -heightOfAllNodeData / 2;
    let cumulativeHeightOfPreNodeData = 0;

    this.rightNodesData.forEach((nodeData) => {
      const top = topOfFirstNodeData + cumulativeHeightOfPreNodeData;
      nodeData.setTopFromRootNode(top);
      cumulativeHeightOfPreNodeData += nodeData.groupHeight;
    });

    this.rightNodesData.forEach((nodeData) => nodeData.updateChildrenTop());
  }
}

export default RootNodeData;
