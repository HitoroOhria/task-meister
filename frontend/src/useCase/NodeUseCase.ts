import MMindMap from '~/domain/model/MMindMap'
import DropPosition from '~/domain/model/DropPosition'

import { newNotFoundNodeErr } from '~/util/ExceptionUtil'

// UseCase of Node.
class NodeUseCase {
  // Set text to node in MindMap.
  // And update placement of all ind map parts.
  public setText(mindMap: MMindMap, selectedNodeId: string, text: string): MMindMap {
    selectedNodeId === mindMap.rootNode.id
      ? (mindMap.rootNode.text = text)
      : mindMap.rightMap.setTextById(selectedNodeId, text)

    mindMap.updateAllPlacement(selectedNodeId)

    return mindMap
  }

  // Enter node to edit mode in MindMap.
  public enterEditMode(mindMap: MMindMap, selectedNodeId: string): MMindMap {
    const selectedNode = mindMap.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }

    selectedNode.isInputting = true

    return mindMap
  }

  // Exit node from edit mode in MindMap.
  public exitEditMode(mindMap: MMindMap, selectedNodeId: string): MMindMap {
    const selectedNode = mindMap.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }

    selectedNode.isInputting = false

    return mindMap
  }

  // Select node in MindMap.
  // Currently selected node is deselected.
  public select(mindMap: MMindMap, selectedNodeId: string): MMindMap {
    mindMap.deselectNode()

    const selectedNode = mindMap.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw new Error(`Can not found selected node by id. id = ${selectedNodeId}`)
    }
    selectedNode.isSelected = true

    return mindMap
  }

  // Drop dragged node on MindMap.
  // And update placement of all mind map parts.
  public dragAndDrop(mindMap: MMindMap, movedNodeId: string, dropPosition: DropPosition): MMindMap {
    if (mindMap.rootNode.onTail(dropPosition.left)) {
      mindMap.processNodeDropToRight(movedNodeId)
      return mindMap
    }

    mindMap.rightMap.dragAndDropNode(movedNodeId, dropPosition)
    mindMap.updateAccessoryPlacement()

    return mindMap
  }

  // Toggle Collapse of node in MindMap.
  // And update placement of all mind map parts.
  public toggleCollapse(mindMap: MMindMap, selectedNodeId: string) {
    if (mindMap.rootNode.isSelected) {
      return mindMap
    }

    mindMap.rightMap.collapseNodes(selectedNodeId)
    mindMap.updateAccessoryPlacement()

    return mindMap
  }
}

export default NodeUseCase
