import Children from '~/domain/model/Children'
import MBaseNode from '~/domain/model/MBaseNode'
import { total } from '~/util/NumberUtil'

type RecursivelyChildrenUpdatableOps = {
  setNodeSize(): void

  setNodeWidth(): void

  setNodeLeft(parentNodeLeft: number, parentNodeWidth: number): void

  setGroupTop(parentHeight: number, parentGroupTop: number): void

  updateNodeTop(): void

  updateGroupAndChildrenHeight(): void

  updateAccessoryPlacement(parentNode: MBaseNode): void

  updateEstimateTimeMinute(): void
}

export const recursivelyChildrenUpdatableOpsImpl: RecursivelyChildrenUpdatableOps = Object.freeze({
  children: {} as Children,

  setNodeSize() {
    this.children.nodes.forEach((child) => child.setSize())
    this.children.nodes.forEach((child) => child.children.recursively.setNodeSize())
  },

  setNodeWidth() {
    this.children.nodes.forEach((node) => node.setWidth())
    this.children.nodes.forEach((node) => node.children.recursively.setNodeWidth())
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

  updateNodeTop() {
    this.children.nodes.forEach((child) => child.updateTop())
    this.children.nodes.forEach((child) => child.children.recursively.updateNodeTop())
  },

  updateGroupAndChildrenHeight() {
    this.children.nodes.forEach((child) =>
      child.group.updateHeight(child.isHidden, child.height, child.children)
    )

    this.children.height = total(this.children.nodes.map((child) => child.group.height))
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
})

export default RecursivelyChildrenUpdatableOps
