import React, { FC, ReactNode, useContext, useEffect, useRef } from "react";

import { OriginPointDispatchCtx } from "~/store/context/OriginPointCtx";
import { originPointActionType as actionType } from "~/store/reducer/OriginPointReducer";

import { svgAreaHeight, svgAreaWidth } from "~/components/organisms/SVGArea";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";

import { newOriginPoint } from "~/domain/model/OriginPoint";

const originX = svgAreaWidth / 2;
const originY = svgAreaHeight / 2;

type Props = {
  children?: ReactNode;
};

const Origin: FC<Props> = (props) => {
  const originElement = useRef<HTMLDivElement>(null);
  const dispatchOriginPoint = useContext(OriginPointDispatchCtx);

  const updateOriginPoint = () => {
    if (originElement.current == null) return;

    const rect = originElement.current.getBoundingClientRect();
    const svgX = originX;
    const svgY = originY;
    const pageX = window.scrollX + rect.left;
    const pageY = window.scrollY + rect.top;

    dispatchOriginPoint({
      type: actionType.setValue,
      payload: newOriginPoint(svgX, svgY, pageX, pageY),
    });
  };

  const scrollToOrigin = () => {
    const windowUpperLeftX = originX - window.innerWidth / 2;
    const windowUpperLeftY = originY - window.innerHeight / 2;

    window.scrollTo(windowUpperLeftX, windowUpperLeftY);
  };

  const componentDidMount = () => {
    window.onresize = updateOriginPoint;
    updateOriginPoint();
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
