import MMindMap from '~/domain/model/MMindMap'

// UseCase of mind map.
class MindMapUseCase {
  // Initialize State of MinaMap.
  public init(mindMap: MMindMap): MMindMap {
    mindMap.rootNode.isSelected = true
    mindMap.setNodeSize()

    mindMap.updateRootNodePlacement()
    if (mindMap.rightMap.children.nodes.length !== 0) {
      const firstNode = mindMap.rightMap.children.nodes[0]
      mindMap.rightMap.updateNodePlacement(firstNode.id)
    }
    mindMap.updateAccessoryPlacement()

    return mindMap
  }
}

export default MindMapUseCase
