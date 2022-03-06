import MindMapData from '~/domain/model/MindMapData'
import { newNotFoundNodeErr } from '~/util/ExceptionUtil'

// UseCase of Node.
class NodeUseCase {
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
}

export default NodeUseCase
