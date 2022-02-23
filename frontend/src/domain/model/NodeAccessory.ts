import NodeData from '~/domain/model/NodeData'
import BezierCurve, { bezierCurveImpl, newBezierCurve } from '~/domain/model/BezierCurve'
import PathLine, { newPathLine, pathLineImpl } from '~/domain/model/PathLine'
import CollapseButton, {
  collapseButtonImpl,
  newCollapseButton,
} from '~/domain/model/CollapseButton'

type NodeAccessory = {
  bezierCurve: BezierCurve
  pathLine: PathLine
  collapseButton: CollapseButton

  updatePoints(parentNode: NodeData, node: NodeData): void
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

  updatePoints(parentNode: NodeData, node: NodeData) {
    this.bezierCurve.updatePoints(parentNode, node)
    this.pathLine.updatePoints(node)
    this.collapseButton.updatePoint(node)
  },
}
Object.freeze(nodeAccessoryImpl)

export default NodeAccessory
