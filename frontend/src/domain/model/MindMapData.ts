import RightMapData from "~/domain/model/RightMapData";
import rightNodesData, { rightNodeDataImpl } from "~/domain/model/RightMapData";
import NodeData, { nodeDataImpl } from "~/domain/model/NodeData";
import DropPosition from "~/domain/model/DropPosition";
import ShortcutController, {
  newShortcutController,
  shortcutControllerImpl,
} from "~/domain/model/ShortcutController";

type MindMapData = {
  selectedNodeId: string;
  isInputting: boolean;
  rootNodeData: NodeData;
  rightMapData: RightMapData;
  leftMapData: rightNodesData;
  shortcutController: ShortcutController;

  setNodeTextById(id: string, text: string): void;

  handleTextChanges(id: string, width: number, height: number): void;

  handleRootNodeTextChanges(width: number, height: number): void;

  updateRootNodeLateral(width: number): void;

  updateRootNodeVertical(height: number): void;

  updateRightNodesLeft(): void;

  handleDropNode(id: string, dropPosition: DropPosition): void;

  handlePressSpace(id: string): void;
};

export const newMindMapData = (
  rootNodeData: NodeData,
  rightNodesData: RightMapData,
  leftNodesData: RightMapData
): MindMapData => {
  const mindMapData: MindMapData = {
    ...mindMapDataImpl,
    rootNodeData: rootNodeData,
    rightMapData: rightNodesData,
    leftMapData: leftNodesData,
  };
  mindMapData.shortcutController = newShortcutController(mindMapData);

  return mindMapData;
};

export const mindMapDataImpl: MindMapData = {
  selectedNodeId: "",
  isInputting: false,
  rootNodeData: nodeDataImpl,
  rightMapData: rightNodeDataImpl,
  leftMapData: rightNodeDataImpl,
  shortcutController: shortcutControllerImpl,

  setNodeTextById(id: string, text: string) {
    if (id === this.rootNodeData.id) {
      this.rootNodeData.text = text;
      return;
    }

    this.rightMapData.setTextById(id, text);
  },

  handleTextChanges(id: string, width: number, height: number) {
    if (id === this.rootNodeData.id) {
      this.handleRootNodeTextChanges(width, height);
      return;
    }

    this.rightMapData.handleTextChanges(id, width, height);
  },

  handleRootNodeTextChanges(width: number, height: number) {
    this.updateRootNodeLateral(width);
    this.updateRootNodeVertical(height);
    this.updateRightNodesLeft();
  },

  updateRootNodeLateral(width: number) {
    this.rootNodeData.width = width;
    this.rootNodeData.left = -width / 2;
  },

  updateRootNodeVertical(height: number) {
    this.rootNodeData.height = height;
    this.rootNodeData.top = -height / 2;
  },

  updateRightNodesLeft() {
    this.rightMapData.nodes.recursively.setNodeLeft(
      this.rootNodeData.left,
      this.rootNodeData.width
    );
  },

  handleDropNode(id: string, dropPosition: DropPosition) {
    this.rightMapData.handleDropNode(id, dropPosition);
  },

  handlePressSpace(id: string) {
    this.rightMapData.collapseNodes(id);
  },
};

Object.freeze(mindMapDataImpl);

export default MindMapData;
