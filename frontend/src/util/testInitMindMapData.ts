import { newNode } from '~/domain/model/MNode'
import { newChildren } from '~/domain/model/Children'
import { newMindMapData } from '~/domain/model/MindMapData'
import { newRootNode } from '~/domain/model/MRootNode'
import { newRightMap } from '~/domain/model/RightMap'
import { newGroup } from '~/domain/model/Group'

// const node1_2_1 = newNode("F", "F", newGroup(), newChildren([]));
// const node1_2_2 = newNode("G", "G", newGroup(), newChildren([]));
// const node1_2_3 = newNode("H", "H", newGroup(), newChildren([]));

// const node1_1 = newNode("C", "C", newGroup(), newChildren([]));
// const node1_2 = newNode(
//   "D",
//   "D",
//   newGroup(),
//   newChildren([node1_2_1, node1_2_2, node1_2_3])
// );
// const node1_3 = newNode("E", "E", newGroup(), newChildren([]));

const node1 = newNode('A', 'A', newGroup(), newChildren([]))
const node2 = newNode('B', 'B', newGroup(), newChildren([]))

const initMindMapData = newMindMapData(
  newRootNode('Root', 'Root'),
  newRightMap(newChildren([node1, node2])),
  newRightMap(newChildren([]))
)

export default initMindMapData
