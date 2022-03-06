import MindMapData from '~/domain/model/MindMapData'

// UseCase of mind map.
class MindMapUseCase {
  // Initialize State of MinaMap.
  public init(mindMapData: MindMapData): MindMapData {
    mindMapData.rootNode.isSelected = true
    mindMapData.setNodeSize()

    mindMapData.updateRootNodePlacement()
    if (mindMapData.rightMap.children.nodes.length !== 0) {
      const firstNode = mindMapData.rightMap.children.nodes[0]
      mindMapData.rightMap.updateNodePlacement(firstNode.id)
    }
    mindMapData.updateAccessoryPlacement()

    return mindMapData
  }
}

export default MindMapUseCase
