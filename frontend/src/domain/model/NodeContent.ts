import MCheckbox, { checkboxImpl, newCheckbox } from '~/domain/model/MCheckbox'
import MEstimateTime, { estimateTimeImpl, newEstimateTime } from '~/domain/model/MEstimateTime'
import MNode from '~/domain/model/MNode'

// NodeContent is inside content of Node.
// NodeContent has checkbox and estimate time.
// NodeContent not have text.
type NodeContent = {
  checkbox: MCheckbox
  estimateTime: MEstimateTime

  getWidth(node: MNode): number

  getHeight(): number
}

export const newNodeContent = (): NodeContent => {
  return {
    ...nodeContentImpl,
    checkbox: newCheckbox(),
    estimateTime: newEstimateTime(),
  }
}

export const nodeContentImpl: NodeContent = Object.freeze({
  checkbox: checkboxImpl,

  estimateTime: estimateTimeImpl,

  getWidth(node: MNode): number {
    return this.checkbox.getWidth() + this.estimateTime.getWidth(node)
  },

  getHeight(): number {
    return Math.max(this.checkbox.getHeight(), this.estimateTime.getHeight())
  },
})

export default NodeContent
