import MBaseNode, { baseNodeImpl } from '~/domain/model/MBaseNode'
import PathLine, { newPathLine, pathLineImpl } from '~/domain/model/PathLine'
import {
  elementSizeCalculator,
  lineHeight,
  minWidth as textMinWidth,
} from '~/components/atoms/NodeText'
import { pickBiggerNumber } from '~/util/NumberUtil'
import { numberOfLines } from '~/util/StringUtil'

// type to distinguish from Node.
export const rootNodeType = 'rootNode'

// This. is RootNode.
// RootNode placements center of mind map.
// RootNode has path line to children.
type MRootNode = MBaseNode & {
  // Type to identify that is not Node.
  type: typeof rootNodeType

  // Straight line of relationship line to children.
  // Curve held by children nodes.
  pathLine: PathLine

  // Update placement.
  updatePlacement(): void

  // Update placement of lateral.
  updateLateral(): void

  // Update placement of vertical.
  updateVertical(): void

  // Update points of path line.
  updatePathLine(): void
}

export const newRootNode = (id: string, text: string): MRootNode => {
  return {
    ...rootNodeImpl,
    id: id,
    text: text,
    pathLine: newPathLine(),
  }
}

export const rootNodeImpl: MRootNode = Object.freeze({
  ...baseNodeImpl,

  type: rootNodeType,
  pathLine: pathLineImpl,

  disable(): boolean {
    return false
  },

  setWidth() {
    const textWidth = elementSizeCalculator.measureLongestLineWidth(this.text)

    this.width = this.getAroundAreaWidth() + pickBiggerNumber(textWidth, textMinWidth)
  },

  setHeight() {
    const textHeight = lineHeight * numberOfLines(this.text)

    this.height = this.getAroundAreaHeight() + textHeight
  },

  updatePlacement() {
    this.updateLateral()
    this.updateVertical()
  },

  updateLateral() {
    this.setWidth()
    this.left = -this.width / 2
  },

  updateVertical() {
    this.setHeight()
    this.top = -this.height / 2
  },

  updatePathLine() {
    this.pathLine.updatePoints(this)
  },
})

export default MRootNode
