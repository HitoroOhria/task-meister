import { height, width } from '~/components/atoms/EstimateTime'
import { estimateTimeSpacerWidth as spacerWidth } from '~/components/organisms/Node'

import Children from '~/domain/model/Children'

import { sum } from '~/util/NumberUtil'

export const initMinute = -1

type MEstimateTime = {
  minute: number
  isEditing: boolean

  inputted(): boolean

  toString(): string

  getWidth(): number

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
    return this.minute === initMinute
  },

  toString(): string {
    return this.minute <= 0 ? '' : this.minute.toString()
  },

  getWidth(): number {
    return spacerWidth + width
  },

  getHeight(): number {
    return height
  },

  updateMinute(children: Children) {
    this.minute = children.nodes.map((node) => node.estimateTime.minute).reduce(sum, 0)
  },
})

export default MEstimateTime
