import MindMapData from "~/domain/model/MindMapData";
import DropPosition from "~/domain/model/DropPosition";
import Shortcut from "~/enum/Shortcut";

export type MindMapDataAction =
  | { type: "setNodeText"; id: string; text: string }
  | { type: "setIsInputting"; isInputting: boolean }
  | { type: "selectNode"; id: string }
  | {
      type: "handleNodeTextChanges";
      id: string;
      width: number;
      height: number;
    }
  | { type: "handleDrop"; id: string; dropPosition: DropPosition }
  | { type: "handleKeydown"; shortcut: Shortcut; selectedNodeId: string };

export const mindMapDataReducer = (
  state: MindMapData,
  action: MindMapDataAction
): MindMapData => {
  let newState: MindMapData | undefined = undefined;
  switch (action.type) {
    case "setNodeText":
      newState = setNodeText(state, action.id, action.text);
      break;
    case "setIsInputting":
      newState = setIsInputting(state, action.isInputting);
      break;
    case "selectNode":
      newState = selectNode(state, action.id);
      break;
    case "handleNodeTextChanges":
      newState = handleNodeTextChanges(
        state,
        action.id,
        action.width,
        action.height
      );
      break;
    case "handleDrop":
      newState = handleDrop(state, action.id, action.dropPosition);
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

  return { ...newState };
};

const setNodeText = (
  mindMapData: MindMapData,
  id: string,
  text: string
): MindMapData => {
  mindMapData.setNodeTextById(id, text);
  return mindMapData;
};

const setIsInputting = (
  mindMapData: MindMapData,
  isInputting: boolean
): MindMapData => {
  mindMapData.isInputting = isInputting;
  return mindMapData;
};

const selectNode = (mindMapData: MindMapData, id: string): MindMapData => {
  mindMapData.deselectNode();

  const selectedNode = mindMapData.findNodeById(id);
  if (!selectedNode) {
    throw new Error(`Can not found selected node by id. id = ${id}`);
  }
  selectedNode.isSelected = true;

  return mindMapData;
};

const handleNodeTextChanges = (
  mindMapData: MindMapData,
  id: string,
  width: number,
  height: number
): MindMapData => {
  mindMapData.handleTextChanges(id, width, height);
  return mindMapData;
};

const handleDrop = (
  mindMapData: MindMapData,
  id: string,
  dropPosition: DropPosition
): MindMapData => {
  mindMapData.handleDropNode(id, dropPosition);
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
