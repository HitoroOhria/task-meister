import MMindMap from '~/domain/model/MMindMap'
import { rootNodeType } from '~/domain/model/MRootNode'

import { newNotFoundNodeErr } from '~/util/ExceptionUtil'

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

    selectedNode.content.estimateTime.minute = minute
    mindMap.rightMap.children.recursively.updateEstimateTimeMinute()

    mindMap.rightMap.updateAllNodesLateral(mindMap.rootNode)
    mindMap.updateAccessoryPlacement()

    return mindMap
  }

  // Enter selected node to edit mode in MindMap.
  // Not enter if checkbox is hidden.
  public enterEditMode(mindMap: MMindMap, selectedNodeId: string): MMindMap {
    const selectedNode = mindMap.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }

    if (selectedNode.type === rootNodeType) {
      return mindMap
    }
    if (selectedNode.content.checkbox.hidden) {
      return mindMap
    }

    selectedNode.content.estimateTime.isEditing = true

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

    selectedNode.content.estimateTime.isEditing = false

    return mindMap
  }
}

export default EstimateTimeUseCase
