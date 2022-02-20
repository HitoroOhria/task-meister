import { horizontalMargin } from '~/components/organisms/Node'
import { pathLineRatio } from '~/components/atoms/RelationshipPath'

import NodeData from '~/domain/model/NodeData'
import PathLine, { newPathLine, pathLineImpl } from '~/domain/model/PathLine'
import BezierCurve, { bezierCurveImpl, newBezierCurve } from '~/domain/model/BezierCurve'

type RelationshipLine = {
  pathLine: PathLine
  bezierCurve: BezierCurve

  getPathCommand(): string

  updatePoints(parentNode: NodeData, node: NodeData): void
}

export const newRelationshipLine = (): RelationshipLine => {
  return {
    ...relationshipLineImpl,
    pathLine: newPathLine(),
    bezierCurve: newBezierCurve(),
  }
}

export const relationshipLineImpl: RelationshipLine = {
  pathLine: pathLineImpl,
  bezierCurve: bezierCurveImpl,

  getPathCommand(): string {
    return [this.pathLine.moveTo(), this.pathLine.lineTo(), this.bezierCurve.curveTo()].join(' ')
  },

  updatePoints(parentNode: NodeData, node: NodeData) {
    const lineStartPointX = parentNode.getElementEndX()
    const lineEndPointX = lineStartPointX + horizontalMargin * 2 * pathLineRatio
    const lineY = parentNode.getElementCenterY()

    const controlPointX = lineEndPointX + (horizontalMargin * 2 * (1 - pathLineRatio)) / 2
    const endPointX = lineStartPointX + horizontalMargin * 2
    const endPointY = node.getElementCenterY()

    this.pathLine.setPoints(lineStartPointX, lineEndPointX, lineY)
    this.bezierCurve.setPoints(controlPointX, lineY, endPointX, endPointY)
  },
}
Object.freeze(relationshipLineImpl)

export default RelationshipLine
