// OriginPoint is data of Origin.
type OriginPoint = {
  pageX: number;
  pageY: number;
};

export const newOriginPoint = (pageX: number, pageY: number): OriginPoint => {
  return {
    ...originPointImpl,
    pageX: pageX,
    pageY: pageY,
  };
};

const originPointImpl: OriginPoint = {
  pageX: 0,
  pageY: 0,
};

Object.freeze(originPointImpl);

export default OriginPoint;
