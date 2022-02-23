import { diameter } from '~/components/atoms/CollapseButton'

import NodeData from '~/domain/model/NodeData'
import Point, { newPoint, pointImpl } from '~/domain/model/Point'

type CollapseButton = {
  point: Point

  updatePoint(node: NodeData): void
}

export const newCollapseButton = (): CollapseButton => {
  return {
    ...collapseButtonImpl,
    point: newPoint(0, 0),
  }
}

export const collapseButtonImpl: CollapseButton = {
  point: pointImpl,

  updatePoint(node: NodeData) {
    this.point.x = node.getElementCollapseX() - diameter / 2
    this.point.y = node.getElementCenterY() - diameter / 2
  },
}
Object.freeze(collapseButtonImpl)

export default CollapseButton
