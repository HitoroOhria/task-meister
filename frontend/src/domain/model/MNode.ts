import _ from 'lodash'

import MBaseNode, { baseNodeImpl } from '~/domain/model/MBaseNode'
import Group, { groupImpl, newGroup } from '~/domain/model/Group'
import Children, { childrenImpl, newChildren } from '~/domain/model/Children'
import NodeContent, { newNodeContent, nodeContentImpl } from '~/domain/model/NodeContent'
import NodeAccessory, { newNodeAccessory, nodeAccessoryImpl } from '~/domain/model/NodeAccessory'
import {
  elementSizeCalculator,
  lineHeight,
  minHeight as textMinHeight,
  minWidth as textMinWidth,
} from '~/components/atoms/NodeText'

import { pickBiggerNumber } from '~/util/NumberUtil'
import { numberOfLines } from '~/util/StringUtil'

// type to distinguish from RootNode.
export const nodeType = 'node'

type MNode = MBaseNode & {
  type: typeof nodeType
  collapsed: boolean
  group: Group
  children: Children
  content: NodeContent
  accessory: NodeAccessory

  showEstimateTime(): boolean

  estimated(): boolean

  hasNodeById(childId: string): boolean

  updateTop(): void

  setLeft(parentLeft: number, parentWidth: number): void

  toggleCollapse(): void
}

// TODO Group and Children to inline.
export const newNode = (id: string, text: string, group: Group, children: Children): MNode => {
  return {
    ...nodeImpl,
    id: id,
    text: text,
    group: group,
    children: children,
    content: newNodeContent(),
    accessory: newNodeAccessory(),
  }
}

export const newAddNode = (left: number): MNode => {
  const id = _.uniqueId('node_')

  return {
    ...newNode(id, '', newGroup(), newChildren([])),
    left: left,
    isInputting: true,
    isSelected: true,
  }
}

export const newAddNodeWithCheckbox = (left: number): MNode => {
  const node = { ...newAddNode(left) }
  node.content.checkbox.hidden = false

  return node
}

// Data of node to be placed on MindMap.
// NodeData consists of a node and children's nodes.
// Whole group is called a group.
// NodeData is not group, but holds value of group to calculate placement.
export const nodeImpl: MNode = Object.freeze({
  ...baseNodeImpl,

  type: nodeType,

  collapsed: false as boolean,

  group: groupImpl,

  // children nodes of this node
  children: childrenImpl,

  content: nodeContentImpl,

  accessory: nodeAccessoryImpl,

  disable(): boolean {
    return this.content.checkbox.checked
  },

  showEstimateTime(): boolean {
    return !this.content.checkbox.hidden || this.children.recursively.estimated()
  },

  estimated(): boolean {
    return !this.content.checkbox.hidden && this.content.estimateTime.inputted()
  },

  setWidth() {
    const textWidth = elementSizeCalculator.measureLongestLineWidth(this.text)
    const elementWidth = pickBiggerNumber(textWidth, textMinWidth) + this.content.getWidth(this)

    this.width = this.getAroundAreaWidth() + elementWidth
  },

  setHeight() {
    const textHeight = lineHeight * numberOfLines(this.text)
    const elementHeight = Math.max(textMinHeight, textHeight, this.content.getHeight())

    this.height = this.getAroundAreaHeight() + elementHeight
  },

  hasNodeById(childId: string): boolean {
    return !!this.children.recursively.findNodeById(childId)
  },

  // Update node top of self
  updateTop() {
    const fromGroupTop =
      this.children.height < this.height ? 0 : (this.children.height - this.height) / 2
    this.top = this.group.top + fromGroupTop
  },

  setLeft(parentLeft: number, parentWidth: number) {
    this.left = parentLeft + parentWidth
  },

  toggleCollapse() {
    this.collapsed = !this.collapsed
    this.children.recursively.toggleHidden()
  },
})

export default MNode
