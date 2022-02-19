import React, { FC, ReactNode, useEffect, useRef } from "react";

import { svgAreaHeight, svgAreaWidth } from "~/components/organisms/SVGArea";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";

export const originX = svgAreaWidth / 2;
export const originY = svgAreaHeight / 2;

type Props = {
  children?: ReactNode;
};

const Origin: FC<Props> = (props) => {
  const originElement = useRef<HTMLDivElement>(null);

  const scrollToOrigin = () => {
    // TODO Why not scroll when reload?
    const windowUpperLeftX = originX - window.innerWidth / 2;
    const windowUpperLeftY = originY - window.innerHeight / 2;

    window.scrollTo(windowUpperLeftX, windowUpperLeftY);
  };

  const componentDidMount = () => {
    scrollToOrigin();
  };

  useEffect(componentDidMount, []);

  return (
    <PositionAdjuster top={originX} left={originY}>
      <div ref={originElement}>{props.children}</div>
    </PositionAdjuster>
  );
};
export default Origin;
