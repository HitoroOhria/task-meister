import {
  borderWidth,
  horizontalMargin,
  padding,
  tailAreaRatio,
  verticalMargin,
} from '~/components/organisms/Node'
import { elementSizeCalculator, lineHeight, minWidth } from '~/components/atoms/TextInputer'
import { originX, originY } from '~/components/organisms/Origin'

import DropPosition from '~/domain/model/DropPosition'
import { numberOfLines } from '~/util/StringUtil'
import { pathLineRatio } from '~/components/atoms/Path'

// Data of Node.
// Hold value of Node.
type NodeData = {
  // An id.
  id: string

  // A text.
  text: string

  // Total width of Node.
  // Including margin, border, padding, element
  width: number

  // Total height of Node.
  // Including margin, border, padding, element
  height: number

  // Top from Origin.
  top: number

  // Left form Origin.
  left: number

  // Flag of node is hidden.
  // Node not render if this flag is true.
  isHidden: boolean

  // Flag of node is selected.
  isSelected: boolean

  // Flag of node is edit mode.
  isInputting: boolean

  // set width and height from text.
  setSize(): void

  // set width from text.
  setWith(): void

  // set height from text.
  setHeight(): void

  // Get element width of Node.
  // Includes only element.
  // Not Includes margin, border, padding.
  getElementWidth(): number

  // Get element tail X from Origin.
  getElementTailX(): number

  // Get element center Y from Origin.
  getElementCenterY(): number

  // Get branch X of tails from Origin.
  getTailBranchX(): number

  // Judge dropPosition in Node area.
  // Node area includes margin, border, padding, element.
  onArea(position: DropPosition): boolean

  // Judge left in x range of Node.
  // X range is includes margin, border, padding, element.
  inXRange(left: number): boolean

  // Judge left in y range of Node.
  // Y range is includes margin, border, padding, element.
  inYRange(top: number): boolean

  // Judge top in Upper half of Node Area.
  // Node area includes margin, border, padding, element.
  onUpper(top: number): boolean

  // Judge left in Tail of Node Area.
  // Node area includes margin, border, padding, element.
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

  getElementTailX(): number {
    return originX + this.left + horizontalMargin + this.getElementWidth()
  },

  getElementCenterY(): number {
    return originY + this.top + this.height / 2
  },

  getTailBranchX(): number {
    return this.getElementTailX() + horizontalMargin * 2 * pathLineRatio
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
