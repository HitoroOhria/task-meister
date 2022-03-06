import MNode from '~/domain/model/MNode'

import Children, { childrenImpl } from '~/domain/model/Children'
import DropPosition from '~/domain/model/DropPosition'
import MRootNode from '~/domain/model/MRootNode'

import { total } from '~/util/NumberUtil'

// RightMap is right part of MindMap.
// RightMap has nodes.
type RightMap = {
  // Nodes.
  children: Children

  // Set text to node of id.
  setTextById(id: string, text: string): void

  // Update placement of all nodes.
  updateNodePlacement(id: string): void

  // Update lateral placement of a nodes and that children nodes.
  updateNodesLateralOfGroup(updatedNode: MNode, left: number): void

  // Update lateral placement of all node.
  updateAllNodesLateral(rootNode: MRootNode): void

  // Update vertical placement of all nodes.
  updateAllNodesVertical(updatedNode: MNode): void

  // Drop dragged node in right map.
  // And update placement of nodes.
  dragAndDropNode(movedNodeId: string, dropPosition: DropPosition): void

  // Insert node to dropped place.
  insertNodeToDroppedPlace(target: MNode, dropPosition: DropPosition, lowerNode: MNode): void

  // Collapse selected node and that children nodes of that.
  // And update placement of nodes.
  collapseNodes(selectedId: string): void
}

export const newRightMap = (nodes: Children): RightMap => {
  return {
    ...rightMapImpl,
    children: nodes,
  }
}

export const rightMapImpl: RightMap = Object.freeze({
  children: childrenImpl,

  setTextById(id: string, text: string) {
    const targetNode = this.children.recursively.findNodeById(id)
    if (!targetNode) {
      throw new Error(`Can not found nodeData by id. id = ${id}`)
    }

    targetNode.text = text
  },

  updateNodePlacement(id: string) {
    const target = this.children.recursively.findNodeById(id)
    if (!target) {
      throw new Error(`Can not found nodeData by id. id = ${id}`)
    }

    this.updateNodesLateralOfGroup(target, target.left)
    this.updateAllNodesVertical(target)
  },

  updateNodesLateralOfGroup(updatedNode: MNode, left: number) {
    updatedNode.setWidth()
    updatedNode.left = left
    updatedNode.children.recursively.setNodeLeft(left, updatedNode.width)
  },

  updateAllNodesLateral(rootNode: MRootNode) {
    this.children.recursively.setNodeWidth()
    this.children.recursively.setNodeLeft(rootNode.left, rootNode.width)
  },

  updateAllNodesVertical(updatedNode: MNode) {
    updatedNode.setHeight()
    this.children.recursively.updateGroupAndChildrenHeight()

    const totalOfGroupHeights = total(this.children.nodes.map((nodeData) => nodeData.group.height))
    const nodesGroupTop = -totalOfGroupHeights / 2
    this.children.recursively.setGroupTop(0, nodesGroupTop)

    this.children.recursively.updateNodeTop()
  },

  dragAndDropNode(movedNodeId: string, dropPosition: DropPosition) {
    const movedNode = this.children.recursively.findNodeById(movedNodeId)
    const lowerNode = this.children.recursively.findNodeByPosition(dropPosition)
    if (!movedNode || !lowerNode) return
    // Cannot move self children.
    if (movedNode.hasNodeById(lowerNode.id)) return

    this.children.recursively.removeNodeById(movedNodeId)
    this.insertNodeToDroppedPlace(movedNode, dropPosition, lowerNode)

    const newLeft = lowerNode.onTail(dropPosition.left)
      ? lowerNode.left + lowerNode.width
      : lowerNode.left
    this.updateNodesLateralOfGroup(movedNode, newLeft)
    this.updateAllNodesVertical(movedNode)
  },

  insertNodeToDroppedPlace(target: MNode, dropPosition: DropPosition, lowerNode: MNode) {
    if (lowerNode.onTail(dropPosition.left)) {
      lowerNode.children.nodes.push(target)
      return
    }

    const children = this.children.recursively.findChildrenContainsId(lowerNode.id)
    if (!children) {
      throw new Error(`Can not found children contains id. id = ${lowerNode.id}`)
    }

    children.insertNode(target, dropPosition.top, lowerNode)
  },

  collapseNodes(selectedId: string) {
    const selectedNode = this.children.recursively.findNodeById(selectedId)
    if (!selectedNode) {
      throw new Error(`Can not found nodeData by id. id = ${selectedId}`)
    }

    selectedNode.toggleCollapse()
    this.updateAllNodesVertical(selectedNode)
  },
})

export default RightMap
