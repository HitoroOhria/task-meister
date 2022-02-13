import React, {
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import { newOriginPoint } from "~/domain/model/OriginPoint";
import { OriginPointDispatchCtx } from "~/store/context/OriginPointCtx";
import { originPointActionType as actionType } from "~/store/reducer/OriginPointReducer";

type Props = {
  children?: ReactNode;
};

// TODO Think name
// this is not origin.
// this is origin + droppable element.
const Origin: FC<Props> = (props) => {
  const originElement = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number>(window.innerHeight / 2);
  const [left, setLeft] = useState<number>(window.innerWidth / 2);
  const dispatchOriginPoint = useContext(OriginPointDispatchCtx);

  const resetPosition = () => {
    setTop(window.innerHeight / 2);
    setLeft(window.innerWidth / 2);
  };

  const updateOriginPoint = () => {
    if (originElement.current == null) return;

    const rect = originElement.current.getBoundingClientRect();
    const pageX = window.scrollX + rect.left;
    const pageY = window.scrollY + rect.top;

    dispatchOriginPoint({
      type: actionType.setValue,
      payload: newOriginPoint(pageX, pageY),
    });
  };

  const handleOnResize = () => {
    resetPosition();
    updateOriginPoint();
  };

  const componentDidMount = () => {
    updateOriginPoint();
    window.onresize = handleOnResize;
  };

  useEffect(componentDidMount, []);

  return (
    <PositionAdjuster top={top} left={left}>
      <div ref={originElement}>{props.children}</div>
    </PositionAdjuster>
  );
};
export default Origin;
