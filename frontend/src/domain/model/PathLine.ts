import MBaseNode from '~/domain/model/MBaseNode'
import Point, { newPoint, pointImpl } from '~/domain/model/Point'

// Path line is part of relationship line.
// This is straight line.
type PathLine = {
  // Start point of line.
  startPoint: Point

  // End point of line.
  endPoint: Point

  // Command for drawing with SVG.
  pathCommand(): string

  // Command of move to for drawing with SVG.
  moveTo(): string

  // Command of line to for drawing with SVG.
  lineTo(): string

  // Update start point and end point from node.
  updatePoints(node: MBaseNode): void

  // Set start point and end point.
  setPoints(startPointX: number, endPointX: number, lineY: number): void
}

export const newPathLine = (): PathLine => {
  return {
    ...pathLineImpl,
    startPoint: newPoint(0, 0),
    endPoint: newPoint(0, 0),
  }
}

export const pathLineImpl: PathLine = Object.freeze({
  startPoint: pointImpl,
  endPoint: pointImpl,

  pathCommand(): string {
    return [this.moveTo(), this.lineTo()].join(' ')
  },

  moveTo(): string {
    return ['M', this.startPoint.toSpaceSeparated()].join(' ')
  },

  lineTo(): string {
    return ['L', this.endPoint.toSpaceSeparated()].join(' ')
  },

  updatePoints(node: MBaseNode) {
    const startPointX = node.getElementTailX()
    const endPointX = node.getTailBranchX()
    const lineY = node.getElementCenterY()

    this.setPoints(startPointX, endPointX, lineY)
  },

  setPoints(startPointX: number, endPointX: number, lineY: number) {
    this.startPoint.x = startPointX
    this.startPoint.y = lineY
    this.endPoint.x = endPointX
    this.endPoint.y = lineY
  },
})

export default PathLine
