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

type MRootNode = MBaseNode & {
  type: typeof rootNodeType
  pathLine: PathLine

  updatePlacement(): void

  updateLateral(): void

  updateVertical(): void

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

export const rootNodeImpl: MRootNode = {
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
}
Object.freeze(rootNodeImpl)

export default MRootNode
