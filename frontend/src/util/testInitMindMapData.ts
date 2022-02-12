import { newNode } from "~/domain/model/Node";
import { newChildren } from "~/domain/model/Children";
import { newMindMapData } from "~/domain/model/MindMapData";
import { newRootNode } from "~/domain/model/RootNode";
import { newRightMap } from "~/domain/model/RightMap";

const node1_2_1 = newNode("F", "F", newChildren([]));
const node1_2_2 = newNode("G", "G", newChildren([]));
const node1_2_3 = newNode("H", "H", newChildren([]));

const node1_1 = newNode("C", "C", newChildren([]));
const node1_2 = newNode(
  "D",
  "D",

  newChildren([node1_2_1, node1_2_2, node1_2_3])
);
const node1_3 = newNode("EEE", "EEE", newChildren([]));

const node1 = newNode(
  "A",
  "A",

  newChildren([node1_1, node1_2, node1_3])
);
const node2 = newNode("B", "B", newChildren([]));

const initMindMapData = newMindMapData(
  newRootNode("Root", "Root"),
  newRightMap(newChildren([node1, node2])),
  newRightMap(newChildren([]))
);

export default initMindMapData;
