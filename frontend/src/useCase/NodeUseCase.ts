import MindMapData from '~/domain/model/MindMapData'
import DropPosition from '~/domain/model/DropPosition'

import { newNotFoundNodeErr } from '~/util/ExceptionUtil'

// UseCase of Node.
class NodeUseCase {
  // Set text to node in MindMap.
  // And update placement of all ind map parts.
  public setText(mindMapData: MindMapData, selectedNodeId: string, text: string): MindMapData {
    selectedNodeId === mindMapData.rootNode.id
      ? (mindMapData.rootNode.text = text)
      : mindMapData.rightMap.setTextById(selectedNodeId, text)

    mindMapData.updateAllPlacement(selectedNodeId)

    return mindMapData
  }

  // Enter node to edit mode in MindMap.
  public enterEditMode(mindMapData: MindMapData, selectedNodeId: string): MindMapData {
    const selectedNode = mindMapData.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }

    selectedNode.isInputting = true

    return mindMapData
  }

  // Exit node from edit mode in MindMap.
  public exitEditMode(mindMapData: MindMapData, selectedNodeId: string): MindMapData {
    const selectedNode = mindMapData.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }

    selectedNode.isInputting = false

    return mindMapData
  }

  // Select node in MindMap.
  // Currently selected node is deselected.
  public select(mindMapData: MindMapData, selectedNodeId: string): MindMapData {
    mindMapData.deselectNode()

    const selectedNode = mindMapData.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw new Error(`Can not found selected node by id. id = ${selectedNodeId}`)
    }
    selectedNode.isSelected = true

    return mindMapData
  }

  // Drop dragged node on MindMap.
  // And update placement of all mind map parts.
  public dragAndDrop(
    mindMapData: MindMapData,
    movedNodeId: string,
    dropPosition: DropPosition
  ): MindMapData {
    if (mindMapData.rootNode.onTail(dropPosition.left)) {
      mindMapData.processNodeDropToRight(movedNodeId)
      return mindMapData
    }

    mindMapData.rightMap.dragAndDropNode(movedNodeId, dropPosition)
    mindMapData.updateAccessoryPlacement()

    return mindMapData
  }

  // Toggle Collapse of node in MindMap.
  // And update placement of all mind map parts.
  public toggleCollapse(mindMapData: MindMapData, selectedNodeId: string) {
    if (mindMapData.rootNode.isSelected) {
      return mindMapData
    }

    mindMapData.rightMap.collapseNodes(selectedNodeId)
    mindMapData.updateAccessoryPlacement()

    return mindMapData
  }
}

export default NodeUseCase
