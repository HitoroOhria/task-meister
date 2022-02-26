import MBaseNode from '~/domain/model/MBaseNode'
import BezierCurve, { bezierCurveImpl, newBezierCurve } from '~/domain/model/BezierCurve'
import PathLine, { newPathLine, pathLineImpl } from '~/domain/model/PathLine'
import MCollapseButton, {
  collapseButtonImpl,
  newCollapseButton,
} from '~/domain/model/MCollapseButton'

type NodeAccessory = {
  bezierCurve: BezierCurve
  pathLine: PathLine
  collapseButton: MCollapseButton

  updatePoints(parentNode: MBaseNode, node: MBaseNode): void
}

export const newNodeAccessory = (): NodeAccessory => {
  return {
    ...nodeAccessoryImpl,
    bezierCurve: newBezierCurve(),
    pathLine: newPathLine(),
    collapseButton: newCollapseButton(),
  }
}

export const nodeAccessoryImpl: NodeAccessory = {
  bezierCurve: bezierCurveImpl,
  pathLine: pathLineImpl,
  collapseButton: collapseButtonImpl,

  updatePoints(parentNode: MBaseNode, node: MBaseNode) {
    this.bezierCurve.updatePoints(parentNode, node)
    this.pathLine.updatePoints(node)
    this.collapseButton.updatePoint(node)
  },
}
Object.freeze(nodeAccessoryImpl)

export default NodeAccessory
