import MBaseNode from '~/domain/model/MBaseNode'
import MNode from '~/domain/model/MNode'
import Children from '~/domain/model/Children'
import DropPosition from '~/domain/model/DropPosition'

import { total } from '~/util/NumberUtil'

interface RecursivelyChildren {
  children: Children

  isInputting(): boolean

  nodeTextIsEditing(): boolean

  estimateTimeIsInputting(): boolean

  findNodeById(id: string): MNode | undefined

  findNodeByPosition(position: DropPosition): MNode | undefined

  findHeadNode(id: string): MNode | undefined

  findNodeIsSelected(): MNode | undefined

  findChildrenContainsId(id: string): Children | undefined

  estimated(): boolean

  displayedCheckbox(): boolean

  removeNodeById(id: string): MNode

  updateNodeTop(): void

  setNodeSize(): void

  setNodeLeft(parentNodeLeft: number, parentNodeWidth: number): void

  setGroupTop(parentHeight: number, parentGroupTop: number): void

  updateGroupAndChildrenHeight(): void

  toggleHidden(): void

  deselectNode(): void

  updateAccessoryPlacement(parentNode: MBaseNode): void

  updateEstimateTimeMinute(): void
}

export const newRecursivelyChildren = (children: Children): RecursivelyChildren => {
  return {
    ...recursivelyChildrenImpl,
    children: children,
  }
}

export const recursivelyChildrenImpl: RecursivelyChildren = {
  children: {} as Children,

  isInputting(): boolean {
    return this.nodeTextIsEditing() || this.estimateTimeIsInputting()
  },

  nodeTextIsEditing(): boolean {
    const editingChild = this.children.nodes.find((child) => child.isInputting)
    if (editingChild) {
      return true
    }

    return !!this.children.nodes.find((child) => child.children.recursively.nodeTextIsEditing())
  },

  estimateTimeIsInputting(): boolean {
    const editingChild = this.children.nodes.find((child) => child.estimateTime.isEditing)
    if (editingChild) {
      return true
    }

    return !!this.children.nodes.find((child) =>
      child.children.recursively.estimateTimeIsInputting()
    )
  },

  findNodeById(id: string): MNode | undefined {
    const child = this.children.nodes.find((child) => child.id === id)
    if (child) {
      return child
    }

    for (const child of this.children.nodes) {
      const target = child.children.recursively.findNodeById(id)

      if (target) {
        return target
      }
    }

    return undefined
  },

  findNodeByPosition(position: DropPosition): MNode | undefined {
    const child = this.children.nodes.find((child) => child.onArea(position))
    if (child) {
      return child
    }

    for (const child of this.children.nodes) {
      const target = child.children.recursively.findNodeByPosition(position)

      if (target) {
        return target
      }
    }

    return undefined
  },

  findHeadNode(id: string): MNode | undefined {
    const node = this.children.findNodeHasChildId(id)
    if (node !== undefined) {
      return node
    }

    for (const child of this.children.nodes) {
      const targetNode = child.children.recursively.findHeadNode(id)

      if (targetNode !== undefined) {
        return targetNode
      }
    }

    return undefined
  },

  findNodeIsSelected(): MNode | undefined {
    const selectedNode = this.children.nodes.find((child) => child.isSelected)
    if (selectedNode) {
      return selectedNode
    }

    for (const child of this.children.nodes) {
      const foundNode = child.children.recursively.findNodeIsSelected()

      if (foundNode) {
        return foundNode
      }
    }

    return undefined
  },

  findChildrenContainsId(id: string): Children | undefined {
    const include = this.children.nodes.map((child) => child.id).includes(id)
    if (include) {
      return this.children
    }

    for (const child of this.children.nodes) {
      const children = child.children.recursively.findChildrenContainsId(id)

      if (children) {
        return children
      }
    }

    return undefined
  },

  estimated(): boolean {
    const estimatedNode = this.children.nodes.find((node) => node.estimated())
    if (estimatedNode) {
      return true
    }

    return !!this.children.nodes.find((node) => node.children.recursively.estimated())
  },

  displayedCheckbox(): boolean {
    const displayedCheckbox = this.children.nodes
      .map((node) => node.checkbox)
      .find((checkbox) => !checkbox.hidden)
    if (displayedCheckbox) {
      return true
    }

    return !!this.children.nodes.find((node) => node.children.recursively.displayedCheckbox())
  },

  removeNodeById(id: string): MNode {
    const children = this.children.recursively.findChildrenContainsId(id)
    if (!children) {
      throw new Error(`Can not found children contains id. id = ${id}`)
    }

    return children.removeNode(id)
  },

  updateNodeTop() {
    this.children.nodes.forEach((child) => child.updateTop())
    this.children.nodes.forEach((child) => child.children.recursively.updateNodeTop())
  },

  setNodeSize() {
    this.children.nodes.forEach((child) => child.setSize())
    this.children.nodes.forEach((child) => child.children.recursively.setNodeSize())
  },

  setNodeLeft(parentNodeLeft: number, parentNodeWidth: number) {
    this.children.nodes.forEach((child) => child.setLeft(parentNodeLeft, parentNodeWidth))
    this.children.nodes.forEach((child) =>
      child.children.recursively.setNodeLeft(child.left, child.width)
    )
  },

  setGroupTop(parentHeight: number, parentGroupTop: number) {
    this.children.setGroupTop(parentHeight, parentGroupTop)
    this.children.nodes.forEach((child) =>
      child.children.recursively.setGroupTop(child.height, child.group.top)
    )
  },

  updateGroupAndChildrenHeight() {
    this.children.nodes.forEach((child) =>
      child.group.updateHeight(child.isHidden, child.height, child.children)
    )

    this.children.height = total(this.children.nodes.map((child) => child.group.height))
  },

  toggleHidden() {
    this.children.nodes.forEach((child) => (child.isHidden = !child.isHidden))
    this.children.nodes.forEach((child) => child.children.recursively.toggleHidden())
  },

  deselectNode() {
    const selectedNode = this.findNodeIsSelected()
    if (!selectedNode) return

    selectedNode.isSelected = false
  },

  updateAccessoryPlacement(parentNode: MBaseNode) {
    this.children.nodes.forEach((child) => child.accessory.updatePoints(parentNode, child))
    this.children.nodes.forEach((child) =>
      child.children.recursively.updateAccessoryPlacement(child)
    )
  },

  updateEstimateTimeMinute() {
    this.children.nodes.forEach((node) => node.children.recursively.updateEstimateTimeMinute())
    this.children.nodes
      .filter((node) => node.children.nodes.length !== 0)
      .forEach((node) => node.estimateTime.updateMinute(node.children))
  },
}

Object.freeze(recursivelyChildrenImpl)

export default RecursivelyChildren
