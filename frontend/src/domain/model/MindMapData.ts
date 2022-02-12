import RootNode, { rootNodeImpl } from "~/domain/model/RootNode";
import RightMap, { rightMapImpl } from "~/domain/model/RightMap";
import ShortcutController, {
  newShortcutController,
  shortcutControllerImpl,
} from "~/domain/model/ShortcutController";
import DropPosition from "~/domain/model/DropPosition";

type MindMapData = {
  // TODO Control readonly, geet, set
  isInputting: boolean;
  rootNode: RootNode;
  rightMap: RightMap;
  leftMap: RightMap;
  shortcutController: ShortcutController;

  setNodeTextById(id: string, text: string): void;

  handleTextChanges(id: string, width: number, height: number): void;

  processRootNodeTextChanges(width: number, height: number): void;

  updateRightNodesLeft(): void;

  handleDropNode(id: string, dropPosition: DropPosition): void;
};

export const newMindMapData = (
  rootNode: RootNode,
  rightMap: RightMap,
  leftMap: RightMap
): MindMapData => {
  const mindMapData: MindMapData = {
    ...mindMapDataImpl,
    rootNode: rootNode,
    rightMap: rightMap,
    leftMap: leftMap,
  };
  mindMapData.shortcutController = newShortcutController(mindMapData);

  return mindMapData;
};

export const mindMapDataImpl: MindMapData = {
  isInputting: false,
  rootNode: rootNodeImpl,
  rightMap: rightMapImpl,
  leftMap: rightMapImpl,
  shortcutController: shortcutControllerImpl,

  setNodeTextById(id: string, text: string) {
    if (id === this.rootNode.id) {
      this.rootNode.text = text;
      return;
    }

    this.rightMap.setTextById(id, text);
  },

  handleTextChanges(id: string, width: number, height: number) {
    if (id === this.rootNode.id) {
      this.processRootNodeTextChanges(width, height);
      return;
    }

    this.rightMap.handleTextChanges(id, width, height);
  },

  processRootNodeTextChanges(width: number, height: number) {
    this.rootNode.updateLateral(width);
    this.rootNode.updateVertical(height);
    this.updateRightNodesLeft();
  },

  updateRightNodesLeft() {
    this.rightMap.nodes.recursively.setNodeLeft(
      this.rootNode.left,
      this.rootNode.width
    );
  },

  handleDropNode(movedNodeId: string, dropPosition: DropPosition) {
    this.rightMap.handleDropNode(movedNodeId, dropPosition);
  },
};

Object.freeze(mindMapDataImpl);

export default MindMapData;
