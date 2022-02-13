import React, { useContext, useEffect, VFC } from "react";
import DroppableArea from "~/components/organisms/DroppableArea";
import Origin from "~/components/organisms/Origin";
import Node from "~/components/organisms/Node";
import Nodes from "~/components/organisms/Nodes";
import {
  MindMapDispatchCtx,
  MindMapStateCtx,
} from "~/store/context/MindMapDataCtx";
import { getShortcut } from "~/enum/Shortcut";

const MindMap: VFC = () => {
  const mindMapData = useContext(MindMapStateCtx);
  const dispatchMindMapData = useContext(MindMapDispatchCtx);

  const handleKeydown = (e: KeyboardEvent) => {
    if (mindMapData.isInputting) return;

    const shortcut = getShortcut(e.key);
    if (!shortcut) return;
    const selectedNodeId =
      mindMapData.rightMap.children.recursively.findNodeIsSelected()?.id;
    if (!selectedNodeId) return;

    dispatchMindMapData({ type: "processKeydown", shortcut, selectedNodeId });
  };

  const handleKeydownEventListerEffect = (): (() => void) => {
    document.body.addEventListener("keydown", handleKeydown);
    return () => document.body.removeEventListener("keydown", handleKeydown);
  };

  useEffect(handleKeydownEventListerEffect, [handleKeydown]);

  // TODO Why is display smaller on monitor?
  return (
    <DroppableArea>
      <Origin>
        {/* TODO Make tail of root node to draggable */}
        <Node nodeData={mindMapData.rootNode} />
        <Nodes nodes={mindMapData.rightMap.children} />
      </Origin>
    </DroppableArea>
  );
};

export default MindMap;
