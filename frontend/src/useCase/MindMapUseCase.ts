import MindMapData from "~/domain/model/MindMapData";
import DropPosition from "~/domain/model/DropPosition";

class MindMapUseCase {
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

  public selectNode(
    mindMapData: MindMapData,
    selectedNodeId: string
  ): MindMapData {
    mindMapData.deselectNode();

    const selectedNode = mindMapData.findNodeById(selectedNodeId);
    if (!selectedNode) {
      throw new Error(
        `Can not found selected node by id. id = ${selectedNodeId}`
      );
    }
    selectedNode.isSelected = true;

    return mindMapData;
  }

  public processNodeTextChanges(
    mindMapData: MindMapData,
    id: string,
    text: string,
    width: number,
    height: number
  ): MindMapData {
    const newMindMapData = this.setNodeText(mindMapData, id, text);
    return this.updatePlacement(newMindMapData, id, width, height);
  }

  private setNodeText(
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

  private updatePlacement(
    mindMapData: MindMapData,
    id: string,
    width: number,
    height: number
  ): MindMapData {
    if (id === mindMapData.rootNode.id) {
      mindMapData.updateRootNodePlacement(width, height);
      return mindMapData;
    }

    mindMapData.rightMap.updatePlacement(id, width, height);
    return mindMapData;
  }

  public processNodeDrop(
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

export default MindMapUseCase;
