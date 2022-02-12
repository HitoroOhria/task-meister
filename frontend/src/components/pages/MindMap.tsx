import React, { DragEvent, FC, useContext, useEffect, useRef } from "react";
import Origin, { OriginHandles } from "~/components/organisms/Origin";
import Node from "~/components/organisms/Node";
import Nodes from "~/components/organisms/Nodes";
import { newDropPosition } from "~/domain/model/DropPosition";
import { getShortcut } from "~/enum/Shortcut";
import {
  MindMapDispatchCtx,
  MindMapStateCtx,
} from "~/store/context/MindMapDataCtx";

const MindMap: FC = () => {
  const originElement = useRef<OriginHandles>(null);
  const mindMapData = useContext(MindMapStateCtx);
  const dispatchMindMapData = useContext(MindMapDispatchCtx);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!originElement.current) return;

    const nodeId = e.dataTransfer!.getData("text/plain");
    const originPoint = originElement.current.getPoint();
    const dropPosition = newDropPosition(e, originPoint!);

    dispatchMindMapData({ type: "handleDrop", id: nodeId, dropPosition });
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (mindMapData.isInputting) return;

    const shortcut = getShortcut(e.key);
    if (!shortcut) return;
    const selectedNodeId =
      mindMapData.rightMap.nodes.recursively.findChildIsSelected()?.id;
    if (!selectedNodeId) return;

    dispatchMindMapData({ type: "handleKeydown", shortcut, selectedNodeId });
  };

  const handleKeydownEventListerEffect = (): (() => void) => {
    document.body.addEventListener("keydown", handleKeydown);
    return () => document.body.removeEventListener("keydown", handleKeydown);
  };

  useEffect(handleKeydownEventListerEffect, [handleKeydown]);

  // TODO Why is display smaller on monitor?
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ width: window.innerWidth, height: window.innerHeight }}
    >
      <Origin ref={originElement}>
        {/* TODO Make tail of root node to draggable */}
        <Node nodeData={mindMapData.rootNode} />
        <Nodes nodes={mindMapData.rightMap.nodes} />
      </Origin>
    </div>
  );
};

export default MindMap;
