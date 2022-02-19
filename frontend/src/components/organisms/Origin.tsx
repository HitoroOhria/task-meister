import React, {
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { OriginPointDispatchCtx } from "~/store/context/OriginPointCtx";
import { originPointActionType as actionType } from "~/store/reducer/OriginPointReducer";

import PositionAdjuster from "~/components/atoms/PositionAdjuster";

import { newOriginPoint } from "~/domain/model/OriginPoint";

type Props = {
  children?: ReactNode;
};

const Origin: FC<Props> = (props) => {
  const originElement = useRef<HTMLDivElement>(null);
  const dispatchOriginPoint = useContext(OriginPointDispatchCtx);
  const [top, setTop] = useState<number>(window.innerHeight / 2);
  const [left, setLeft] = useState<number>(window.innerWidth / 2);

  const resetPosition = () => {
    setTop(window.innerHeight / 2);
    setLeft(window.innerWidth / 2);
  };

  const updateOriginPoint = () => {
    if (originElement.current == null) return;

    const rect = originElement.current.getBoundingClientRect();
    const clientX = window.innerWidth / 2;
    const clientY = window.innerHeight / 2;
    const pageX = window.scrollX + rect.left;
    const pageY = window.scrollY + rect.top;

    dispatchOriginPoint({
      type: actionType.setValue,
      payload: newOriginPoint(clientX, clientY, pageX, pageY),
    });
  };

  const handleResize = () => {
    resetPosition();
    updateOriginPoint();
  };

  const componentDidMount = () => {
    updateOriginPoint();
    window.onresize = handleResize;
  };

  useEffect(componentDidMount, []);

  return (
    <PositionAdjuster top={top} left={left}>
      <div ref={originElement}>{props.children}</div>
    </PositionAdjuster>
  );
};
export default Origin;
