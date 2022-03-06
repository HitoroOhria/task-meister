import RightMap, { rightMapImpl } from '~/domain/model/RightMap'
import MRootNode, { rootNodeImpl, rootNodeType } from '~/domain/model/MRootNode'
import MNode from '~/domain/model/MNode'

// This is MindMap.
// MindMap has RootNode and RightMap, LeftMap.
// Operate whole mind map.
type MMindMap = {
  rootNode: MRootNode
  rightMap: RightMap
  // Do not implement left map at this time.
  leftMap: RightMap

  isInputting(): boolean

  // Check id of node is in first layer of root node children.
  isFirstLayerNode(id: string): boolean

  // Find node by id.
  // Return undefined if not found.
  findNodeById(id: string): MRootNode | MNode | undefined

  // Find node is selected.
  // Return undefined if not found.
  findNodeIsSelected(): MRootNode | MNode | undefined

  // find head node of id.
  // Return undefined if not found.
  findHeadNode(id: string): MRootNode | MNode | undefined

  // Check there is displayed checkbox node in ancestor.
  hasDisplayedCheckboxAncestorNode(id: string): boolean

  // Set size of all node.
  setNodeSize(): void

  // Deselect currently selected node.
  deselectNode(): void

  // Select tail node of currently selected node.
  selectTail(): void

  // Update placement of all mind map parts.
  // Parts is node, relationship line, collapse button.
  updateAllPlacement(id: string): void

  // Update placement of all nodes.
  updateNodePlacement(id: string): void

  // Update placement of root node.
  updateRootNodePlacement(): void

  // Update placement of all accessory.
  updateAccessoryPlacement(): void

  // Drop node to right map.
  dropNodeToRight(movedNodeId: string): void
}

export const newMindMap = (
  rootNode: MRootNode,
  rightMap: RightMap,
  leftMap: RightMap
): MMindMap => {
  return {
    ...mindMapImpl,
    rootNode: rootNode,
    rightMap: rightMap,
    leftMap: leftMap,
  }
}

export const mindMapImpl: MMindMap = Object.freeze({
  rootNode: rootNodeImpl,
  rightMap: rightMapImpl,
  leftMap: rightMapImpl,

  isInputting(): boolean {
    return this.rightMap.children.recursively.isInputting() || this.rootNode.isInputting
  },

  isFirstLayerNode(id: string): boolean {
    return !!this.rightMap.children.nodes.find((node) => node.id === id)
  },

  findNodeById(id: string): MRootNode | MNode | undefined {
    if (this.rootNode.id === id) {
      return this.rootNode
    }

    return this.rightMap.children.recursively.findNodeById(id)
  },

  findNodeIsSelected(): MRootNode | MNode | undefined {
    if (this.rootNode.isSelected) {
      return this.rootNode
    }

    return this.rightMap.children.recursively.findNodeIsSelected()
  },

  findHeadNode(id: string): MRootNode | MNode | undefined {
    if (this.isFirstLayerNode(id)) {
      return this.rootNode
    }

    return this.rightMap.children.recursively.findHeadNode(id)
  },

  hasDisplayedCheckboxAncestorNode(id: string): boolean {
    const headNode = this.findHeadNode(id)
    if (!headNode || headNode.type === rootNodeType) {
      return false
    }

    if (!headNode.checkbox.hidden) {
      return true
    }

    return this.hasDisplayedCheckboxAncestorNode(headNode.id)
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
      return
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

  dropNodeToRight(movedNodeId: string) {
    const movedNode = this.rightMap.children.recursively.removeNodeById(movedNodeId)
    this.rightMap.children.nodes.push(movedNode)

    const newLeft = this.rootNode.width / 2
    this.rightMap.updateNodesLateralOfGroup(movedNode, newLeft)
    this.rightMap.updateAllNodesVertical(movedNode)
  },
})

export default MMindMap
