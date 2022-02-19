// OriginPoint is data of Origin.
type OriginPoint = {
  svgX: number;
  svgY: number;
  pageX: number;
  pageY: number;
};

export const newOriginPoint = (
  svgX: number,
  svgY: number,
  pageX: number,
  pageY: number
): OriginPoint => {
  return {
    ...originPointImpl,
    svgX: svgX,
    svgY: svgY,
    pageX: pageX,
    pageY: pageY,
  };
};

const originPointImpl: OriginPoint = {
  svgX: 0,
  svgY: 0,
  pageX: 0,
  pageY: 0,
};

Object.freeze(originPointImpl);

export default OriginPoint;
