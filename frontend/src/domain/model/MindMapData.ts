import RightMap, { rightMapImpl } from '~/domain/model/RightMap'
import RootNode, { rootNodeImpl } from '~/domain/model/RootNode'
import Node from '~/domain/model/Node'

type MindMapData = {
  rootNode: RootNode
  rightMap: RightMap
  leftMap: RightMap

  isInputting(): boolean

  isFirstLayerNode(id: string): boolean

  findNodeById(id: string): RootNode | Node | undefined

  findNodeIsSelected(): RootNode | Node | undefined

  findHeadNode(id: string): RootNode | Node | undefined

  deselectNode(): void

  selectTail(): void

  updateRootNodePlacement(width: number, height: number): void

  processNodeDropToRight(movedNodeId: string): void

  updateRelationshipLine(): void
}

export const newMindMapData = (
  rootNode: RootNode,
  rightMap: RightMap,
  leftMap: RightMap
): MindMapData => {
  return {
    ...mindMapDataImpl,
    rootNode: rootNode,
    rightMap: rightMap,
    leftMap: leftMap,
  }
}

export const mindMapDataImpl: MindMapData = {
  rootNode: rootNodeImpl,
  rightMap: rightMapImpl,
  leftMap: rightMapImpl,

  isInputting(): boolean {
    return this.rightMap.children.recursively.isInputting()
  },

  isFirstLayerNode(id: string): boolean {
    return !!this.rightMap.children.nodes.find((node) => node.id === id)
  },

  findNodeById(id: string): RootNode | Node | undefined {
    if (this.rootNode.id === id) {
      return this.rootNode
    }

    return this.rightMap.children.recursively.findNodeById(id)
  },

  findNodeIsSelected(): RootNode | Node | undefined {
    if (this.rootNode.isSelected) {
      return this.rootNode
    }

    return this.rightMap.children.recursively.findNodeIsSelected()
  },

  findHeadNode(id: string): RootNode | Node | undefined {
    if (this.isFirstLayerNode(id)) {
      return this.rootNode
    }

    return this.rightMap.children.recursively.findHeadNode(id)
  },

  deselectNode() {
    if (this.rootNode.isSelected) {
      this.rootNode.isSelected = false
      return
    }

    this.rightMap.children.recursively.deselectNode()
  },

  selectTail() {
    if (!this.rightMap.children.nodes[0]) return

    this.deselectNode()
    this.rightMap.children.nodes[0].isSelected = true
  },

  updateRootNodePlacement(width: number, height: number) {
    this.rootNode.updateLateral(width)
    this.rootNode.updateVertical(height)
    this.rightMap.children.recursively.setNodeLeft(this.rootNode.left, this.rootNode.width)
  },

  processNodeDropToRight(movedNodeId: string) {
    const movedNode = this.rightMap.children.recursively.removeNodeById(movedNodeId)
    this.rightMap.children.nodes.push(movedNode)

    const newLeft = this.rootNode.width / 2
    this.rightMap.updateNodesLateral(movedNode, movedNode.width, newLeft)
    this.rightMap.updateNodesVertical(movedNode, movedNode.height)
  },

  updateRelationshipLine() {
    this.rightMap.children.recursively.updateRelationshipLine(this.rootNode)
  },
}

Object.freeze(mindMapDataImpl)

export default MindMapData
