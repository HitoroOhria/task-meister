import MindMapData from "~/domain/model/MindMapData";
import DropPosition from "~/domain/model/DropPosition";
import Shortcut from "~/enum/Shortcut";
import MindMapUseCase from "~/useCase/MindMapUseCase";
import ArrowKeyUseCase from "~/useCase/ArrowKeyUseCase";
import ShortcutUseCase from "~/useCase/ShortcutUseCase";
import RootNode from "~/domain/model/RootNode";
import Node from "~/domain/model/Node";

export const mindMapDataActionType = {
  setNodeIsInputting: "MIND_MAP_DATA_SET_NODE_IS_INPUTTING",
  // TODO Delete to take from Node.
  //   - Is performance okay?
  setGlobalIsInputting: "MIND_MAP_DATA_SET_GLOBAL_IS_INPUTTING",
  selectNode: "MIND_MAP_DATA_SELECT_NODE",
  processNodeTextChanges: "MIND_MAP_DATA_PROCESS_NODE_TEXT_CHANGES",
  processNodeDrop: "MIND_MAP_DATA_PROCESS_NODE_DROP",
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
  selectedNode: RootNode | Node;
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
  let newState: MindMapData | undefined = undefined;

  switch (action.type) {
    case mindMapDataActionType.setNodeIsInputting:
      newState = mindMapUseCase.setNodeIsInputting(
        state,
        action.payload.id!,
        action.payload.isInputting!
      );
      break;
    case mindMapDataActionType.setGlobalIsInputting:
      newState = setGlobalIsInputting(state, action.payload.isInputting!);
      break;
    case mindMapDataActionType.selectNode:
      newState = mindMapUseCase.selectNode(state, action.payload.id!);
      break;
    case mindMapDataActionType.processNodeTextChanges:
      newState = mindMapUseCase.processNodeTextChanges(
        state,
        action.payload.id!,
        action.payload.text!,
        action.payload.width!,
        action.payload.height!
      );
      break;
    case mindMapDataActionType.processNodeDrop:
      newState = mindMapUseCase.processNodeDrop(
        state,
        action.payload.id!,
        action.payload.dropPosition!
      );
      break;
    case mindMapDataActionType.processKeydown:
      newState = shortcutUseCase.handleKeydown(
        state,
        action.payload.shortcut!,
        action.payload.selectedNode!
      );
      break;
    default:
      throw new Error(`Not defined action type. action = ${action}`);
  }

  // TODO Why not reflect collapse Node?
  return { ...newState };
};

const setGlobalIsInputting = (
  mindMapData: MindMapData,
  isInputting: boolean
): MindMapData => {
  mindMapData.isInputting = isInputting;
  return mindMapData;
};

export default MindMapDataAction;
