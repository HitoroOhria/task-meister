import MindMapData from "~/domain/model/MindMapData";

class MinaMapUseCase {
  public setNodeText(
    mindMapData: MindMapData,
    id: string,
    text: string
  ): MindMapData {
    if (mindMapData.rootNode.id === id) {
      mindMapData.rootNode.text = text;
      return mindMapData;
    }

    mindMapData.rightMap.setTextById(id, text);
    return mindMapData;
  }

  public setNodeIsInputting(
    mindMapData: MindMapData,
    id: string,
    isInputting: boolean
  ): MindMapData {
    const targetNode = mindMapData.findNodeById(id);
    if (!targetNode) {
      throw new Error(`Can not found Node by id. id = ${id}`);
    }

    targetNode.isInputting = isInputting;
    return mindMapData;
  }

  public selectNode(mindMapData: MindMapData, id: string): MindMapData {
    mindMapData.deselectNode();

    const selectedNode = mindMapData.findNodeById(id);
    if (!selectedNode) {
      throw new Error(`Can not found selected node by id. id = ${id}`);
    }
    selectedNode.isSelected = true;

    return mindMapData;
  }
}

export default MinaMapUseCase;
