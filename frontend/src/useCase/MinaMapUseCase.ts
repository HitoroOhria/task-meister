import MindMapData from "~/domain/model/MindMapData";
import DropPosition from "~/domain/model/DropPosition";

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

  processNodeTextChanges(
    mindMapData: MindMapData,
    id: string,
    width: number,
    height: number
  ): MindMapData {
    if (id === mindMapData.rootNode.id) {
      mindMapData.processRootNodeTextChanges(width, height);
      return mindMapData;
    }

    mindMapData.rightMap.processNodeTextChanges(id, width, height);
    return mindMapData;
  }

  processNodeDrop(
    mindMapData: MindMapData,
    movedNodeId: string,
    dropPosition: DropPosition
  ): MindMapData {
    if (mindMapData.rootNode.onTail(dropPosition.left)) {
      mindMapData.processNodeDropToRight(movedNodeId);
      return mindMapData;
    }

    mindMapData.rightMap.processNodeDrop(movedNodeId, dropPosition);
    return mindMapData;
  }
}

export default MinaMapUseCase;
