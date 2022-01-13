import NodeData from "./NodeData";

class NodeDataList {
  private readonly list: NodeData[];

  constructor(ids: string[]) {
    this.list = ids.map((id) => new NodeData(id));
  }
}

export default NodeDataList;
