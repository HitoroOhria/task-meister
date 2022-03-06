import { height, width } from '~/components/atoms/EstimateTime'
import { estimateTimeSpacerWidth as spacerWidth } from '~/components/organisms/Node'

import Children from '~/domain/model/Children'

import { sum } from '~/util/NumberUtil'
import MNode from '~/domain/model/MNode'

export const initMinute = -1

type MEstimateTime = {
  minute: number
  isEditing: boolean

  inputted(): boolean

  toString(): string

  getWidth(node: MNode): number

  getHeight(): number

  updateMinute(children: Children): void
}

export const newEstimateTime = (): MEstimateTime => {
  return {
    ...estimateTimeImpl,
  }
}

export const estimateTimeImpl: MEstimateTime = Object.freeze({
  minute: initMinute,
  isEditing: false,

  inputted(): boolean {
    return this.minute !== initMinute
  },

  toString(): string {
    return this.minute <= 0 ? '' : this.minute.toString()
  },

  getWidth(node: MNode): number {
    return node.showEstimateTime() ? spacerWidth + width : 0
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
})

export default MEstimateTime
