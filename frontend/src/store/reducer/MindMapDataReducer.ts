import MindMapData from "~/domain/model/MindMapData";
import DropPosition from "~/domain/model/DropPosition";

import MindMapUseCase from "~/useCase/MindMapUseCase";
import ArrowKeyUseCase from "~/useCase/ArrowKeyUseCase";
import ShortcutUseCase from "~/useCase/ShortcutUseCase";

import Shortcut from "~/enum/Shortcut";

export const mindMapDataActionType = {
  setNodeIsInputting: "MIND_MAP_DATA_SET_NODE_IS_INPUTTING",
  selectNode: "MIND_MAP_DATA_SELECT_NODE",
  processNodeTextChanges: "MIND_MAP_DATA_PROCESS_NODE_TEXT_CHANGES",
  processNodeDrop: "MIND_MAP_DATA_PROCESS_NODE_DROP",
  updateRelationshipLine: "MIND_MAP_DATA_UPDATE_RELATIONSHIP_LINE",
  updateAllRelationshipLine: "MIND_MAP_DATA_UPDATE_ALL_RELATIONSHIP_LINE",
  processKeydown: "MIND_MAP_DATA_PROCESS_KEYDOWN",
} as const;

type MindMapDataActionType =
  typeof mindMapDataActionType[keyof typeof mindMapDataActionType];

// TODO Write validator?
type MindMapDataPayload = Partial<{
  id: string;
  width: number;
  height: number;
  text: string;
  isInputting: boolean;
  dropPosition: DropPosition;
  shortcut: Shortcut;
}>;

export type MindMapDataAction = {
  type: MindMapDataActionType;
  payload: MindMapDataPayload;
};

const mindMapUseCase = new MindMapUseCase();
const arrowKeyUseCase = new ArrowKeyUseCase();
const shortcutUseCase = new ShortcutUseCase(arrowKeyUseCase);

export const mindMapDataReducer = (
  state: MindMapData,
  action: MindMapDataAction
): MindMapData => {
  const newState = { ...state };

  // TODO Can rewrite to using Map?
  switch (action.type) {
    case mindMapDataActionType.setNodeIsInputting:
      return mindMapUseCase.setNodeIsInputting(
        newState,
        action.payload.id!,
        action.payload.isInputting!
      );
    case mindMapDataActionType.selectNode:
      return mindMapUseCase.selectNode(newState, action.payload.id!);
    case mindMapDataActionType.processNodeTextChanges:
      return mindMapUseCase.processNodeTextChanges(
        newState,
        action.payload.id!,
        action.payload.text!,
        action.payload.width!,
        action.payload.height!
      );
    case mindMapDataActionType.processNodeDrop:
      return mindMapUseCase.processNodeDrop(
        newState,
        action.payload.id!,
        action.payload.dropPosition!
      );
    case mindMapDataActionType.updateRelationshipLine:
      return mindMapUseCase.updateRelationshipLine(
        newState,
        action.payload.id!,
        action.payload.text!
      );
    case mindMapDataActionType.updateAllRelationshipLine:
      return mindMapUseCase.updateAllRelationshipLine(newState);
    case mindMapDataActionType.processKeydown:
      return shortcutUseCase.handleKeydown(newState, action.payload.shortcut!);
    default:
      throw new Error(`Not defined action type. action = ${action}`);
  }
};

export default MindMapDataAction;
