import Point, { newPoint, pointImpl } from '~/domain/model/Point'

type PathLine = {
  startPoint: Point
  endPoint: Point

  moveTo(): string

  lineTo(): string

  setPoints(startPointX: number, endPointX: number, lineY: number): void
}

export const newPathLine = (): PathLine => {
  return {
    ...pathLineImpl,
    startPoint: newPoint(0, 0),
    endPoint: newPoint(0, 0),
  }
}

export const pathLineImpl: PathLine = {
  startPoint: pointImpl,
  endPoint: pointImpl,

  moveTo(): string {
    return ['M', this.startPoint.toSpaceSeparated()].join(' ')
  },

  lineTo(): string {
    return ['L', this.endPoint.toSpaceSeparated()].join(' ')
  },

  setPoints(startPointX: number, endPointX: number, lineY: number) {
    this.startPoint.x = startPointX
    this.startPoint.y = lineY
    this.endPoint.x = endPointX
    this.endPoint.y = lineY
  },
}
Object.freeze(pathLineImpl)

export default PathLine
