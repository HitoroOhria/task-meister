import { height, width } from '~/components/atoms/EstimateTime'
import { estimateTimeSpacerWidth as spacerWidth } from '~/components/organisms/Node'

type MEstimateTime = {
  minute: number
  isEditing: boolean

  toString(): string

  getWidth(): number

  getHeight(): number
}

export const newEstimateTime = (): MEstimateTime => {
  return {
    ...estimateTimeImpl,
  }
}

export const estimateTimeImpl: MEstimateTime = Object.freeze({
  minute: -1,
  isEditing: false,

  toString(): string {
    return this.minute < 0 ? '' : this.minute.toString()
  },

  getWidth(): number {
    return spacerWidth + width
  },

  getHeight(): number {
    return height
  },
})

export default MEstimateTime
