import { diameter } from '~/components/atoms/CollapseButton'

import MBaseNode from '~/domain/model/MBaseNode'
import Point, { newPoint, pointImpl } from '~/domain/model/Point'

type CollapseButton = {
  point: Point

  updatePoint(node: MBaseNode): void
}

export const newCollapseButton = (): CollapseButton => {
  return {
    ...collapseButtonImpl,
    point: newPoint(0, 0),
  }
}

export const collapseButtonImpl: CollapseButton = {
  point: pointImpl,

  updatePoint(node: MBaseNode) {
    this.point.x = node.getTailBranchX() - diameter / 2
    this.point.y = node.getElementCenterY() - diameter / 2
  },
}
Object.freeze(collapseButtonImpl)

export default CollapseButton
