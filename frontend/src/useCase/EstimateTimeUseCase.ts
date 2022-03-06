import MMindMap from '~/domain/model/MMindMap'
import { newNotFoundNodeErr } from '~/util/ExceptionUtil'
import { rootNodeType } from '~/domain/model/MRootNode'

// UseCase of EstimateTime.
class EstimateTimeUseCase {
  // Set minute of EstimateTime in MindMap.
  // And update all minute of ancestor EstimateTime.
  // And Update accessory placement.
  public setMinute(mindMap: MMindMap, selectedNodeId: string, minute: number): MMindMap {
    const selectedNode = mindMap.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }
    if (selectedNode.type === rootNodeType) {
      return mindMap
    }

    selectedNode.estimateTime.minute = minute
    mindMap.rightMap.children.recursively.updateEstimateTimeMinute()

    mindMap.rightMap.updateAllNodesLateral(mindMap.rootNode)
    mindMap.updateAccessoryPlacement()

    return mindMap
  }

  // Enter selected node to edit mode in MindMap.
  public enterEditMode(mindMap: MMindMap, selectedNodeId: string): MMindMap {
    const selectedNode = mindMap.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }
    if (selectedNode.type === rootNodeType) {
      return mindMap
    }

    selectedNode.estimateTime.isEditing = true

    return mindMap
  }

  // Exit selected node from edit mode in MindMap.
  public exitEditMode(mindMap: MMindMap, selectedNodeId: string): MMindMap {
    const selectedNode = mindMap.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }
    if (selectedNode.type === rootNodeType) {
      return mindMap
    }

    selectedNode.estimateTime.isEditing = false

    return mindMap
  }
}

export default EstimateTimeUseCase
