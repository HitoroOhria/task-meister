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

  setNodeSize(): void

  deselectNode(): void

  selectTail(): void

  updateAllPlacement(id: string): void

  updateNodePlacement(id: string): void

  updateRootNodePlacement(): void

  updateAccessoryPlacement(): void

  processNodeDropToRight(movedNodeId: string): void
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

  setNodeSize() {
    this.rootNode.setSize()
    this.rightMap.children.recursively.setNodeSize()
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

  updateAllPlacement(id: string) {
    this.updateNodePlacement(id)
    this.updateAccessoryPlacement()
  },

  updateNodePlacement(id: string) {
    if (id === this.rootNode.id) {
      this.updateRootNodePlacement()
    }

    this.rightMap.updateNodePlacement(id)
  },

  updateRootNodePlacement() {
    this.rootNode.updatePlacement()
    this.rightMap.children.recursively.setNodeLeft(this.rootNode.left, this.rootNode.width)
  },

  updateAccessoryPlacement() {
    this.rootNode.updatePathLine()
    this.rightMap.children.recursively.updateAccessoryPlacement(this.rootNode)
  },

  processNodeDropToRight(movedNodeId: string) {
    const movedNode = this.rightMap.children.recursively.removeNodeById(movedNodeId)
    this.rightMap.children.nodes.push(movedNode)

    const newLeft = this.rootNode.width / 2
    this.rightMap.updateNodesLateral(movedNode, newLeft)
    this.rightMap.updateNodesVertical(movedNode)
  },
}

Object.freeze(mindMapDataImpl)

export default MindMapData
