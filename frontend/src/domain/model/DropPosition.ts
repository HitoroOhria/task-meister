import {DragEvent} from "react";

import {originX, originY} from "~/components/organisms/Origin";

// DropPosition is position where Node fell.
type DropPosition = {
  // top from origin
  top: number;
  // left from origin
  left: number;
};

export const newDropPosition = (
  event: DragEvent<HTMLDivElement>
): DropPosition => {
  return {
    ...dropPositionImpl,
    top: event.pageY - originY,
    left: event.pageX - originX,
  };
};

const dropPositionImpl: DropPosition = {
  top: 0,
  left: 0,
};

Object.freeze(dropPositionImpl);

export default DropPosition;
