import MNode from '~/domain/model/MNode'
import RecursivelyChildrenOps, {
  newRecursivelyChildrenOps,
  recursivelyChildrenOpsImpl,
} from '~/domain/model/RecursivelyChildrenOps'

import { newNotFoundNodeErr } from '~/util/ExceptionUtil'

// Collection of NodeData.
// Define process to be managed as a whole¬.
type Children = {
  // Collection of nodes
  nodes: MNode[]

  // total height of children node.
  height: number

  recursively: RecursivelyChildrenOps

  findNodeHasChildId(childId: string): MNode | undefined

  findTopNodeOf(childId: string): MNode | undefined

  findBottomNodeOf(childId: string): MNode | undefined

  findTailNodeOf(childId: string): MNode | undefined

  filterHasChild(): MNode[]

  removeNode(id: string): MNode

  insertNode(target: MNode, dropTop: number, lowerNode: MNode): void

  insertNodeToBottomOf(topNodeId: string, addedNode: MNode): void

  setGroupTop(parentChildrenHeight: number, parentGroupTop: number): void
}

export const newChildren = (nodes: MNode[]): Children => {
  const children: Children = {
    ...childrenImpl,
    nodes: nodes,
  }
  children.recursively = newRecursivelyChildrenOps(children)

  return children
}

export const childrenImpl: Children = {
  nodes: [],
  height: 0,
  recursively: recursivelyChildrenOpsImpl,

  findNodeHasChildId(childId: string): MNode | undefined {
    const childrenIsContainId = (node: MNode, id: string): boolean => {
      return node.children.nodes.map((grandChild) => grandChild.id).includes(id)
    }

    return this.nodes.find((child) => childrenIsContainId(child, childId))
  },

  findTopNodeOf(childId: string): MNode | undefined {
    const baseNodeIndex = this.nodes.findIndex((child) => child.id === childId)
    if (baseNodeIndex === -1) {
      return undefined
    }

    return baseNodeIndex === 0 ? this.nodes[this.nodes.length - 1] : this.nodes[baseNodeIndex - 1]
  },

  findBottomNodeOf(childId: string): MNode | undefined {
    const baseNodeIndex = this.nodes.findIndex((child) => child.id === childId)
    if (baseNodeIndex === -1) {
      return undefined
    }

    return baseNodeIndex === this.nodes.length - 1 ? this.nodes[0] : this.nodes[baseNodeIndex + 1]
  },

  findTailNodeOf(childId: string): MNode | undefined {
    return this.nodes.find((child) => child.id === childId)?.children.nodes[0]
  },

  filterHasChild(): MNode[] {
    return this.nodes.filter((child) => child.children.nodes.length !== 0)
  },

  removeNode(id: string): MNode {
    const removedChild = this.nodes.find((child) => child.id === id)
    const removedChildIndex = this.nodes.findIndex((child) => child.id === id)
    if (!removedChild || removedChildIndex === -1) {
      throw new Error(`can not found targetId to remove from children. id = ${id}`)
    }

    this.nodes.splice(removedChildIndex, 1)
    return removedChild
  },

  insertNode(targetNode: MNode, dropTop: number, lowerNode: MNode) {
    let insertedNodeIndex = this.nodes.findIndex((child) => child.id === lowerNode.id)
    if (insertedNodeIndex === -1) {
      throw new Error(`index out of list. index = ${insertedNodeIndex}`)
    }

    !lowerNode.onUpper(dropTop) && insertedNodeIndex++
    this.nodes.splice(insertedNodeIndex, 0, targetNode)
  },

  insertNodeToBottomOf(topNodeId: string, addedNode: MNode) {
    const topNodeIndex = this.nodes.findIndex((child) => child.id === topNodeId)
    if (topNodeIndex === -1) {
      throw newNotFoundNodeErr(topNodeId)
    }

    this.nodes.splice(topNodeIndex + 1, 0, addedNode)
  },

  setGroupTop(parentChildrenHeight: number, parentGroupTop: number) {
    let fromParentGroupTop =
      this.height < parentChildrenHeight ? (parentChildrenHeight - this.height) / 2 : 0

    this.nodes.forEach((child) => {
      child.group.setTop(parentGroupTop, fromParentGroupTop)
      fromParentGroupTop += child.group.height
    })
  },
}

Object.freeze(childrenImpl)

export default Children
