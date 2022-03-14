import { elementSizeCalculator, height, unit, width } from '~/components/atoms/EstimateTime'
import { estimateTimeSpacerWidth as spacerWidth } from '~/components/organisms/Node'

import Children from '~/domain/model/Children'
import MNode from '~/domain/model/MNode'

import { sum } from '~/util/NumberUtil'

export const initMinute = -1

type MEstimateTime = {
  minute: number
  isEditing: boolean
  readOnly: boolean

  inputted(): boolean

  toString(): string

  getWidth(node: MNode): number

  getElementWidth(): number

  getReadOnlyText(): string

  getHeight(): number

  updateMinute(children: Children): void

  // Set read only from Node.
  // Depends on hidden of Checkbox.
  setReadOnly(node: MNode): void
}

export const newEstimateTime = (): MEstimateTime => {
  return {
    ...estimateTimeImpl,
  }
}

export const estimateTimeImpl: MEstimateTime = Object.freeze({
  minute: initMinute,
  isEditing: false,
  readOnly: false as boolean,

  inputted(): boolean {
    return this.minute !== initMinute
  },

  toString(): string {
    return this.minute <= 0 ? '' : this.minute.toString()
  },

  getWidth(node: MNode): number {
    return node.showEstimateTime() ? spacerWidth + this.getElementWidth() : 0
  },

  getElementWidth(): number {
    return this.readOnly ? elementSizeCalculator.measureWidth(this.getReadOnlyText()) : width
  },

  getReadOnlyText(): string {
    return this.minute.toString() + ' ' + unit.toLowerCase()
  },

  getHeight(): number {
    return height
  },

  updateMinute(children: Children) {
    this.minute = children.nodes
      .filter((node) => node.showEstimateTime() && node.content.estimateTime.inputted())
      .map((node) => node.content.estimateTime.minute)
      .reduce(sum, 0)
  },

  setReadOnly(node: MNode) {
    this.readOnly = node.content.checkbox.hidden
  },
})

export default MEstimateTime
