import React, { useContext, useEffect, VFC } from "react";

import { mindMapDataActionType as actionType } from "~/store/reducer/MindMapDataReducer";
import {
  MindMapDispatchCtx,
  MindMapStateCtx,
} from "~/store/context/MindMapDataCtx";

import KeyCombo from "~/domain/model/KeyCombo";

import { isMovingScreen, shortcuts } from "~/enum/Shortcut";

const keyCombo = new KeyCombo();

type Props = {
  setIsShitEnter: (isShiftEnter: boolean) => void;
};

const KeydownManager: VFC<Props> = (props) => {
  const mindMapData = useContext(MindMapStateCtx);
  const dispatchMindMapData = useContext(MindMapDispatchCtx);

  const handleKeydown = (e: KeyboardEvent) => {
    keyCombo.add(e.key);
    const shortcut = keyCombo.getShortcut();
    if (!shortcut) return;

    props.setIsShitEnter(shortcut === shortcuts.ShiftEnter);

    if (mindMapData.isInputting()) return;

    if (isMovingScreen(shortcut)) {
      e.preventDefault();
    }

    dispatchMindMapData({
      type: actionType.processKeydown,
      payload: { shortcut },
    });
  };

  const handleKeyup = (e: KeyboardEvent) => {
    keyCombo.up(e.key);
  };

  const keydownEffect = (): (() => void) => {
    document.body.addEventListener("keydown", handleKeydown);
    return () => document.body.removeEventListener("keydown", handleKeydown);
  };

  const keyupEffect = (): (() => void) => {
    document.body.addEventListener("keyup", handleKeyup);
    return () => document.body.removeEventListener("keyup", handleKeyup);
  };

  useEffect(keydownEffect, [handleKeydown]);
  useEffect(keyupEffect, []);

  return <></>;
};

export default KeydownManager;
