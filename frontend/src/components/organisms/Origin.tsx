import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import OriginPoint, { newOriginPoint } from "~/domain/model/OriginPoint";

type OriginProps = {
  children?: ReactNode;
};

export type OriginHandles = {
  getPoint: () => OriginPoint | null;
};

const Origin = forwardRef<OriginHandles, OriginProps>((props, ref) => {
  const originElement = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number>(window.innerHeight / 2);
  const [left, setLeft] = useState<number>(window.innerWidth / 2);

  const getPoint = (): OriginPoint | null => {
    if (originElement.current == null) return null;

    const rect = originElement.current.getBoundingClientRect();
    const pageX = window.scrollX + rect.left;
    const pageY = window.scrollY + rect.top;

    return newOriginPoint(pageX, pageY);
  };

  const resetPosition = () => {
    setTop(window.innerHeight / 2);
    setLeft(window.innerWidth / 2);
  };

  const componentDidMount = () => {
    window.onresize = resetPosition;
  };

  useEffect(componentDidMount, []);
  useImperativeHandle(ref, () => ({ getPoint: getPoint }));

  return (
    <PositionAdjuster top={top} left={left}>
      <div ref={originElement}>{props.children}</div>
    </PositionAdjuster>
  );
});
export default Origin;
