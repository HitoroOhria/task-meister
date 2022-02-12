import { newNestableNode } from "~/domain/model/Node";
import { newGroup } from "~/domain/model/Group";
import { newChildren } from "~/domain/model/Children";
import { newMindMapData } from "~/domain/model/MindMapData";
import { newRootNode } from "~/domain/model/RootNode";
import { newRightMap } from "~/domain/model/RightMap";

const node1_2_1 = newNestableNode("F", "F", newGroup(), newChildren([]));
const node1_2_2 = newNestableNode("G", "G", newGroup(), newChildren([]));
const node1_2_3 = newNestableNode("H", "H", newGroup(), newChildren([]));

const node1_1 = newNestableNode("C", "C", newGroup(), newChildren([]));
const node1_2 = newNestableNode(
  "D",
  "D",
  newGroup(),
  newChildren([node1_2_1, node1_2_2, node1_2_3])
);
const node1_3 = newNestableNode("EEE", "EEE", newGroup(), newChildren([]));

const node1 = newNestableNode(
  "A",
  "A",
  newGroup(),
  newChildren([node1_1, node1_2, node1_3])
);
const node2 = newNestableNode("B", "B", newGroup(), newChildren([]));

const initMindMapData = newMindMapData(
  newRootNode("Root", "Root"),
  newRightMap(newChildren([node1, node2])),
  newRightMap(newChildren([]))
);

export default initMindMapData;
