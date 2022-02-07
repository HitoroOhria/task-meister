import {DragEvent} from "react";
import OriginPoint from "~/domain/model/OriginPoint";

// DropPosition is position where Node fell.
type DropPosition = {
  // top from origin
  top: number;
  // left from origin
  left: number;
};

export const newDropPosition = (
  event: DragEvent<HTMLDivElement>,
  originPoint: OriginPoint
): DropPosition => {
  return {
    ...dropPositionImpl,
    top: event.pageY - originPoint.pageY,
    left: event.pageX - originPoint.pageX,
  };
};

const dropPositionImpl: DropPosition = {
  top: 0,
  left: 0,
};

Object.freeze(dropPositionImpl);

export default DropPosition;
