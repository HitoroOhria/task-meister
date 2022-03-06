import MindMapData from '~/domain/model/MindMapData'
import { newNotFoundNodeErr } from '~/util/ExceptionUtil'
import { rootNodeType } from '~/domain/model/MRootNode'

// UseCase of EstimateTime.
class EstimateTimeUseCase {
  // Set minute of EstimateTime.
  // And update all minute of ancestor EstimateTime.
  // And Update accessory placement.
  public setMinute(mindMapData: MindMapData, selectedNodeId: string, minute: number): MindMapData {
    const selectedNode = mindMapData.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }
    if (selectedNode.type === rootNodeType) {
      return mindMapData
    }

    selectedNode.estimateTime.minute = minute
    mindMapData.rightMap.children.recursively.updateEstimateTimeMinute()

    mindMapData.rightMap.updateNodesLateralWhenEstimated(mindMapData.rootNode)
    mindMapData.updateAccessoryPlacement()

    return mindMapData
  }

  // Enter selected node to edit mode.
  public enterEditMode(mindMapData: MindMapData, selectedNodeId: string): MindMapData {
    const selectedNode = mindMapData.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }
    if (selectedNode.type === rootNodeType) {
      return mindMapData
    }

    selectedNode.estimateTime.isEditing = true

    return mindMapData
  }

  // Exit selected node from edit mode.
  public exitEditMode(mindMapData: MindMapData, selectedNodeId: string): MindMapData {
    const selectedNode = mindMapData.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }
    if (selectedNode.type === rootNodeType) {
      return mindMapData
    }

    selectedNode.estimateTime.isEditing = false

    return mindMapData
  }
}

export default EstimateTimeUseCase
