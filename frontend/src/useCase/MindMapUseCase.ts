import MindMapData from '~/domain/model/MindMapData'
import DropPosition from '~/domain/model/DropPosition'

import { newNotFoundNodeErr } from '~/util/ExceptionUtil'

class MindMapUseCase {
  public init(mindMapData: MindMapData): MindMapData {
    mindMapData.setNodeSize()

    mindMapData.updateRootNodePlacement()
    if (mindMapData.rightMap.children.nodes.length !== 0) {
      const firstNode = mindMapData.rightMap.children.nodes[0]
      mindMapData.rightMap.updateNodePlacement(firstNode.id)
    }
    mindMapData.updateAccessoryPlacement()

    return mindMapData
  }

  public selectNode(mindMapData: MindMapData, selectedNodeId: string): MindMapData {
    mindMapData.deselectNode()

    const selectedNode = mindMapData.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw new Error(`Can not found selected node by id. id = ${selectedNodeId}`)
    }
    selectedNode.isSelected = true

    return mindMapData
  }

  public enterNodeEditMode(mindMapData: MindMapData, selectedNodeId: string): MindMapData {
    const selectedNode = mindMapData.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }

    selectedNode.isInputting = true

    return mindMapData
  }

  public exitNodeEditMode(mindMapData: MindMapData, selectedNodeId: string): MindMapData {
    const selectedNode = mindMapData.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNodeId)
    }

    selectedNode.isInputting = false

    return mindMapData
  }

  public processNodeTextChanges(mindMapData: MindMapData, id: string, text: string): MindMapData {
    id === mindMapData.rootNode.id
      ? (mindMapData.rootNode.text = text)
      : mindMapData.rightMap.setTextById(id, text)

    mindMapData.updateAllPlacement(id)

    return mindMapData
  }

  public toggleCollapse(mindMapData: MindMapData, selectedNodeId: string) {
    if (mindMapData.rootNode.isSelected) {
      return mindMapData
    }

    mindMapData.rightMap.collapseNodes(selectedNodeId)
    mindMapData.updateAccessoryPlacement()

    return mindMapData
  }

  public updateRelationshipLine(mindMapData: MindMapData, id: string, text: string): MindMapData {
    // TODO Optimize in following cases
    //   - change text
    //   - new line
    //   - add node
    mindMapData.updateAccessoryPlacement()
    return mindMapData
  }

  public updateAllRelationshipLine(mindMapData: MindMapData): MindMapData {
    mindMapData.updateAccessoryPlacement()
    return mindMapData
  }

  public processNodeDrop(
    mindMapData: MindMapData,
    movedNodeId: string,
    dropPosition: DropPosition
  ): MindMapData {
    if (mindMapData.rootNode.onTail(dropPosition.left)) {
      mindMapData.processNodeDropToRight(movedNodeId)
      return mindMapData
    }

    mindMapData.rightMap.processNodeDrop(movedNodeId, dropPosition)
    mindMapData.updateAccessoryPlacement()

    return mindMapData
  }
}

export default MindMapUseCase
