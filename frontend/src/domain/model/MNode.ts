import _ from 'lodash'

import NodeData, { nodeDataImpl } from '~/domain/model/NodeData'
import Group, { groupImpl, newGroup } from '~/domain/model/Group'
import Children, { childrenImpl, newChildren } from '~/domain/model/Children'
import NodeAccessory, { newNodeAccessory, nodeAccessoryImpl } from '~/domain/model/NodeAccessory'
import MCheckbox, { checkboxImpl, newCheckbox } from '~/domain/model/MCheckbox'

import { spacerWidth } from '~/components/organisms/Node'
import {
  elementSizeCalculator,
  lineHeight,
  minWidth as textMinWidth,
} from '~/components/atoms/TextInputer'
import { height as checkboxHeight, width as checkboxWidth } from '~/components/atoms/Checkbox'

import { pickBiggerNumber } from '~/util/NumberUtil'
import { numberOfLines } from '~/util/StringUtil'

// type to distinguish from RootNode.
export const nodeType = 'node'

type MNode = NodeData & {
  type: typeof nodeType
  group: Group
  children: Children
  checkbox: MCheckbox
  accessory: NodeAccessory

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
    checkbox: newCheckbox(),
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

// Data of node to be placed on MindMap.
// NodeData consists of a node and children's nodes.
// Whole group is called a group.
// NodeData is not group, but holds value of group to calculate placement.
export const nodeImpl: MNode = {
  ...nodeDataImpl,

  type: nodeType,

  group: groupImpl,

  // children nodes of this node
  children: childrenImpl,

  checkbox: checkboxImpl,

  accessory: nodeAccessoryImpl,

  setWidth() {
    const textWidth = elementSizeCalculator.measureLongestLineWidth(this.text)
    const checkboxAreaWidth = this.checkbox.hidden ? 0 : checkboxWidth + spacerWidth
    const elementWidth = checkboxAreaWidth + pickBiggerNumber(textWidth, textMinWidth)

    this.width = this.getAroundAreaWidth() + elementWidth
  },

  setHeight() {
    const textHeight = lineHeight * numberOfLines(this.text)
    const elementHeight = pickBiggerNumber(checkboxHeight, textHeight)

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
    this.group.isHidden = !this.group.isHidden
    this.children.recursively.toggleHidden()
  },
}

Object.freeze(nodeImpl)

export default MNode
