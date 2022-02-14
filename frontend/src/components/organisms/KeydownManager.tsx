import React, { useContext, useEffect, VFC } from "react";
import { mindMapDataActionType as actionType } from "~/store/reducer/MindMapDataReducer";
import {
  MindMapDispatchCtx,
  MindMapStateCtx,
} from "~/store/context/MindMapDataCtx";
import { getShortcut } from "~/enum/Shortcut";

const KeydownManager: VFC = () => {
  const mindMapData = useContext(MindMapStateCtx);
  const dispatchMindMapData = useContext(MindMapDispatchCtx);

  const handleKeydown = (e: KeyboardEvent) => {
    if (mindMapData.isInputting) return;

    const shortcut = getShortcut(e.key);
    if (!shortcut) return;
    const selectedNode = mindMapData.findNodeIsSelected();
    if (!selectedNode) return;

    dispatchMindMapData({
      type: actionType.processKeydown,
      payload: { shortcut, selectedNode },
    });
  };

  const keydownEffect = (): (() => void) => {
    document.body.addEventListener("keydown", handleKeydown);
    return () => document.body.removeEventListener("keydown", handleKeydown);
  };

  useEffect(keydownEffect, [handleKeydown]);

  return <></>;
};

export default KeydownManager;
