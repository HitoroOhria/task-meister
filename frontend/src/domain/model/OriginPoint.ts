// OriginPoint is data of Origin.
type OriginPoint = {
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
};

export const newOriginPoint = (
  clientX: number,
  clientY: number,
  pageX: number,
  pageY: number
): OriginPoint => {
  return {
    ...originPointImpl,
    clientX: clientX,
    clientY: clientY,
    pageX: pageX,
    pageY: pageY,
  };
};

const originPointImpl: OriginPoint = {
  clientX: 0,
  clientY: 0,
  pageX: 0,
  pageY: 0,
};

Object.freeze(originPointImpl);

export default OriginPoint;
