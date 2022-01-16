import NodeData from "~/domain/model/NodeData";

class RootNodeData {
  public rightNodesData: NodeData[];
  public leftNodesData: NodeData[];

  constructor(rightNodesData: NodeData[], leftNodesData: NodeData[]) {
    this.rightNodesData = rightNodesData;
    this.leftNodesData = leftNodesData;
  }
}

export default RootNodeData;