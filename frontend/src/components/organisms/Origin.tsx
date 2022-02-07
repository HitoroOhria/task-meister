import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";

type OriginProps = {
  children?: ReactNode;
};

export type OriginHandles = {
  getPagePoint: () => [number, number];
};

const Origin = forwardRef<OriginHandles, OriginProps>((props, ref) => {
  const originElement = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number>(window.innerHeight / 2);
  const [left, setLeft] = useState<number>(window.innerWidth / 2);

  const getPagePoint = (): [number, number] => {
    if (originElement.current == null) return [0, 0];

    const rect = originElement.current.getBoundingClientRect();
    const pageX = window.scrollX + rect.left;
    const pageY = window.scrollY + rect.top;

    return [pageX, pageY];
  };

  useImperativeHandle(ref, () => ({ getPagePoint }));

  const resetPosition = () => {
    setTop(window.innerHeight / 2);
    setLeft(window.innerWidth / 2);
  };

  const componentDidMount = () => {
    window.onresize = resetPosition;
  };

  useEffect(componentDidMount, []);

  return (
    <PositionAdjuster top={top} left={left}>
      <div ref={originElement}>{props.children}</div>
    </PositionAdjuster>
  );
});
export default Origin;
