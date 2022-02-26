import MNode from '~/domain/model/MNode'
import Children, { childrenImpl } from '~/domain/model/Children'
import DropPosition from '~/domain/model/DropPosition'
import { total } from '~/util/NumberUtil'

type RightMap = {
  children: Children

  setTextById(id: string, text: string): void

  updateNodePlacement(id: string): void

  updateNodesLateral(updatedNode: MNode, left: number): void

  updateNodesVertical(updatedNode: MNode): void

  processNodeDrop(movedNodeId: string, dropPosition: DropPosition): void

  insertNode(target: MNode, dropPosition: DropPosition, lowerNode: MNode): void

  collapseNodes(selectedId: string): void
}

export const newRightMap = (nodes: Children): RightMap => {
  return {
    ...rightMapImpl,
    children: nodes,
  }
}

export const rightMapImpl: RightMap = {
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

    this.updateNodesLateral(target, target.left)
    this.updateNodesVertical(target)
  },

  updateNodesLateral(updatedNode: MNode, left: number) {
    updatedNode.setWidth()
    updatedNode.left = left
    updatedNode.children.recursively.setNodeLeft(left, updatedNode.width)
  },

  updateNodesVertical(updatedNode: MNode) {
    updatedNode.setHeight()
    this.children.recursively.updateGroupAndChildrenHeight()

    const totalOfGroupHeights = total(this.children.nodes.map((nodeData) => nodeData.group.height))
    const nodesGroupTop = -totalOfGroupHeights / 2
    this.children.recursively.setGroupTop(0, nodesGroupTop)

    this.children.recursively.updateNodeTop()
  },

  processNodeDrop(movedNodeId: string, dropPosition: DropPosition) {
    const movedNode = this.children.recursively.findNodeById(movedNodeId)
    const lowerNode = this.children.recursively.findNodeByPosition(dropPosition)
    if (!movedNode || !lowerNode) return
    // Cannot move self children.
    if (movedNode.hasNodeById(lowerNode.id)) return

    this.children.recursively.removeNodeById(movedNodeId)
    this.insertNode(movedNode, dropPosition, lowerNode)

    const newLeft = lowerNode.onTail(dropPosition.left)
      ? lowerNode.left + lowerNode.width
      : lowerNode.left
    this.updateNodesLateral(movedNode, newLeft)
    this.updateNodesVertical(movedNode)
  },

  insertNode(target: MNode, dropPosition: DropPosition, lowerNode: MNode) {
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
    this.updateNodesVertical(selectedNode)
  },
}

Object.freeze(rightMapImpl)

export default RightMap
