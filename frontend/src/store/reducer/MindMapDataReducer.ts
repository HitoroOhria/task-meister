import MindMapData from "~/domain/model/MindMapData";
import DropPosition from "~/domain/model/DropPosition";
import Shortcut from "~/enum/Shortcut";
import MinaMapUseCase from "~/useCase/MinaMapUseCase";

export type MindMapDataAction =
  | { type: "setNodeText"; id: string; text: string }
  // TODO Cut out to original store.
  | { type: "setNodeIsInputting"; id: string; isInputting: boolean }
  | { type: "setGlobalIsInputting"; isInputting: boolean }
  | { type: "selectNode"; id: string }
  | {
      type: "processNodeTextChanges";
      id: string;
      width: number;
      height: number;
    }
  | { type: "processNodeDrop"; id: string; dropPosition: DropPosition }
  | { type: "handleKeydown"; shortcut: Shortcut; selectedNodeId: string };

const mindMapUseCase = new MinaMapUseCase();

export const mindMapDataReducer = (
  state: MindMapData,
  action: MindMapDataAction
): MindMapData => {
  let newState: MindMapData | undefined = undefined;
  switch (action.type) {
    case "setNodeText":
      newState = mindMapUseCase.setNodeText(state, action.id, action.text);
      break;
    case "setNodeIsInputting":
      newState = mindMapUseCase.setNodeIsInputting(
        state,
        action.id,
        action.isInputting
      );
      break;
    case "setGlobalIsInputting":
      newState = setGlobalIsInputting(state, action.isInputting);
      break;
    case "selectNode":
      newState = mindMapUseCase.selectNode(state, action.id);
      break;
    case "processNodeTextChanges":
      newState = mindMapUseCase.processNodeTextChanges(
        state,
        action.id,
        action.width,
        action.height
      );
      break;
    case "processNodeDrop":
      newState = mindMapUseCase.processNodeDrop(
        state,
        action.id,
        action.dropPosition
      );
      break;
    case "handleKeydown":
      newState = handleKeydown(state, action.shortcut, action.selectedNodeId);
      break;
    default:
      throw new Error(`Not defined action type. action = ${action}`);
  }
  if (!newState) {
    throw new Error(`NewState is undefined!`);
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

const handleKeydown = (
  mindMapData: MindMapData,
  shortcut: Shortcut,
  selectedNodeId: string
): MindMapData => {
  return mindMapData.shortcutController.handleKeydown(shortcut, selectedNodeId);
};

export default MindMapDataAction;
