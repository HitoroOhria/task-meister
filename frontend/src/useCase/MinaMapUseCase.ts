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
}

export default MinaMapUseCase