import Point, { newPoint, pointImpl } from "~/domain/model/Point";

type BezierCurve = {
  firstControlPoint: Point;
  secondControlPoint: Point;
  endPoint: Point;

  curveTo(): string;

  setPoints(
    controlPointX: number,
    firstControlPointY: number,
    endPointX: number,
    endPointY: number
  ): void;
};

export const newBezierCurve = (): BezierCurve => {
  return {
    ...bezierCurveImpl,
    firstControlPoint: newPoint(0, 0),
    secondControlPoint: newPoint(0, 0),
    endPoint: newPoint(0, 0),
  };
};

export const initBezierCurve = (
  controlPointX: number,
  firstControlPointY: number,
  secondControlPointY: number,
  endPointX: number,
  endPointY: number
): BezierCurve => {
  return {
    ...bezierCurveImpl,
    firstControlPoint: newPoint(controlPointX, firstControlPointY),
    secondControlPoint: newPoint(controlPointX, secondControlPointY),
    endPoint: newPoint(endPointX, endPointY),
  };
};

export const bezierCurveImpl: BezierCurve = {
  firstControlPoint: pointImpl,
  secondControlPoint: pointImpl,
  endPoint: pointImpl,

  curveTo(): string {
    return [
      "C",
      this.firstControlPoint.toSpaceSeparated(),
      this.secondControlPoint.toSpaceSeparated(),
      this.endPoint.toSpaceSeparated(),
    ].join(" ");
  },

  setPoints(
    controlPointX: number,
    firstControlPointY: number,
    endPointX: number,
    endPointY: number
  ) {
    this.firstControlPoint.x = controlPointX;
    this.firstControlPoint.y = firstControlPointY;
    this.secondControlPoint.x = controlPointX;
    this.secondControlPoint.y = endPointY;
    this.endPoint.x = endPointX;
    this.endPoint.y = endPointY;
  },
};
Object.freeze(bezierCurveImpl);

export default BezierCurve;
