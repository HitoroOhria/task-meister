import { borderWidth, horizontalMargin, padding, verticalMargin } from '~/components/organisms/Node'
import { elementSizeCalculator, lineHeight, minWidth } from '~/components/atoms/TextInputer'
import { originX, originY } from '~/components/organisms/Origin'

import DropPosition from '~/domain/model/DropPosition'
import { numberOfLines } from '~/util/StringUtil'

// Ratio of width representing tail area of node.
const tailAreaRatio = 0.2

type NodeData = {
  id: string
  text: string
  width: number
  height: number
  top: number
  left: number
  isHidden: boolean
  isSelected: boolean
  isInputting: boolean

  setSize(): void

  setWith(): void

  setHeight(): void

  getElementWidth(): number

  getElementEndX(): number

  getElementCenterY(): number

  onArea(position: DropPosition): boolean

  inXRange(left: number): boolean

  inYRange(top: number): boolean

  onUpper(top: number): boolean

  onTail(left: number): boolean
}

export const nodeDataImpl: NodeData = {
  // an id for identify when updating node
  id: '',

  // an text of node
  text: '',

  // width including margin
  width: 0,

  // height including height
  height: 0,

  // node top value of style
  top: 0,

  // node left value of style
  left: 0,

  isHidden: false,

  isSelected: false,

  isInputting: false,

  setSize() {
    this.setWith()
    this.setHeight()
  },

  setWith() {
    const textWidth =
      elementSizeCalculator.measureLongestLineWidth(this.text) < minWidth
        ? minWidth
        : elementSizeCalculator.measureLongestLineWidth(this.text)

    this.width = horizontalMargin * 2 + borderWidth * 2 + padding * 2 + textWidth
  },

  setHeight() {
    const textHeight = lineHeight * numberOfLines(this.text)

    this.height = verticalMargin * 2 + borderWidth * 2 + padding * 2 + textHeight
  },

  getElementWidth(): number {
    return this.width - horizontalMargin * 2
  },

  getElementEndX(): number {
    return originX + this.left + horizontalMargin + this.getElementWidth()
  },

  getElementCenterY(): number {
    return originY + this.top + this.height / 2
  },

  onArea(position: DropPosition): boolean {
    return this.inXRange(position.left) && this.inYRange(position.top)
  },

  // TODO Respond to left map.
  //   - Maybe invert width when left map
  inXRange(left: number): boolean {
    return this.left < left && left < this.left + this.width
  },

  inYRange(top: number): boolean {
    return this.top < top && top < this.top + this.height
  },

  onUpper(top: number): boolean {
    const center = this.top + this.height / 2

    return this.top < top && top < center
  },

  // TODO Respond to left map.
  //   - Maybe invert width when left map
  onTail(left: number): boolean {
    const borderLeft = this.left + this.width * (1 - tailAreaRatio)
    const tailLeft = this.left + this.width

    return borderLeft < left && left < tailLeft
  },
}
Object.freeze(nodeDataImpl)

export default NodeData
