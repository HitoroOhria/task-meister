import React, { DragEvent, FC, ReactNode, useContext } from "react";
import { mindMapDataActionType as actionType } from "~/store/reducer/MindMapDataReducer";
import { OriginPointStateCtx } from "~/store/context/OriginPointCtx";
import { MindMapDispatchCtx } from "~/store/context/MindMapDataCtx";
import { newDropPosition } from "~/domain/model/DropPosition";

type Props = {
  children?: ReactNode;
};

const DroppableArea: FC<Props> = (props) => {
  const originPoint = useContext(OriginPointStateCtx);
  const dispatchMindMapData = useContext(MindMapDispatchCtx);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const nodeId = e.dataTransfer!.getData("text/plain");
    const dropPosition = newDropPosition(e, originPoint);

    dispatchMindMapData({
      type: actionType.processNodeDrop,
      payload: { id: nodeId, dropPosition },
    });
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ width: window.innerWidth, height: window.innerHeight }}
    >
      {props.children}
    </div>
  );
};

export default DroppableArea;
