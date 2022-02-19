import React, { useContext, useEffect, VFC } from "react";

import { mindMapDataActionType as actionType } from "~/store/reducer/MindMapDataReducer";
import {
  MindMapDispatchCtx,
  MindMapStateCtx,
} from "~/store/context/MindMapDataCtx";

import KeyCombo from "~/domain/model/KeyCombo";

import { isMovingScreen } from "~/enum/Shortcut";

const keyCombo = new KeyCombo();

const KeydownManager: VFC = () => {
  const mindMapData = useContext(MindMapStateCtx);
  const dispatchMindMapData = useContext(MindMapDispatchCtx);

  const handleKeydown = (e: KeyboardEvent) => {
    if (mindMapData.isInputting()) return;

    keyCombo.add(e.key);
    const shortcut = keyCombo.getShortcut();
    if (!shortcut) return;

    if (isMovingScreen(shortcut)) {
      e.preventDefault();
    }

    dispatchMindMapData({
      type: actionType.processKeydown,
      payload: { shortcut },
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
