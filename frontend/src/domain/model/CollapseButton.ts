import { horizontalMargin } from '~/components/organisms/Node'
import { pathLineRatio } from '~/components/atoms/RelationshipPath'
import { diameter } from '~/components/atoms/CollapseButton'

import Node from '~/domain/model/Node'
import Point, { newPoint, pointImpl } from '~/domain/model/Point'

type CollapseButton = {
  point: Point

  setPoint(node: Node): void
}

export const newCollapseButton = (): CollapseButton => {
  return {
    ...collapseButtonImpl,
    point: newPoint(0, 0),
  }
}

export const collapseButtonImpl: CollapseButton = {
  point: pointImpl,

  setPoint(node: Node) {
    const buttonCenterX = node.getElementEndX() + horizontalMargin * 2 * pathLineRatio

    this.point.x = buttonCenterX - diameter / 2
    this.point.y = node.getElementCenterY() - diameter / 2
  },
}
Object.freeze(collapseButtonImpl)

export default CollapseButton
