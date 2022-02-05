import React, { FC, useState } from "react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import Node from "~/components/organisms/Node";
import MindMapData, { newMindMapData } from "~/domain/model/MindMapData";
import { newRightNodesData } from "~/domain/model/RightMapData";
import NodeData, { newNodeData } from "~/domain/model/NodeData";
import { newGroup } from "~/domain/model/Group";
import Children, { newChildren } from "~/domain/model/Children";

const node1_1 = newNodeData(
  "id1-1 of right",
  "id1-1 of right",
  newGroup(),
  newChildren([])
);
const node1_2 = newNodeData(
  "id1-2 of right",
  "id1-2 of right",
  newGroup(),
  newChildren([])
);
const node1 = newNodeData(
  "id1 of right",
  "id1 of right",
  newGroup(),
  newChildren([node1_1, node1_2])
);
const node2 = newNodeData(
  "id2 of right",
  "id2 of right",
  newGroup(),
  newChildren([])
);

const mindMapDataObj = newMindMapData(
  newNodeData("rootNode", "rootNode", newGroup(), newChildren([])),
  newRightNodesData(newChildren([node1, node2])),
  newRightNodesData(newChildren([]))
);

const MindMap: FC = () => {
  const [mindMapData, setMindMapData] = useState<MindMapData>(mindMapDataObj);
  const [top] = useState<number>(window.innerHeight / 2);
  const [left] = useState<number>(window.innerWidth / 2);

  const setNodeDataText = (id: string, text: string) => {
    mindMapData.setNodeTextById(id, text);
    setMindMapData({ ...mindMapData });
  };

  const processChangingNodeDataText = (
    id: string,
    width: number,
    height: number
  ) => {
    mindMapData.handleTextChanges(id, width, height);
    setMindMapData({ ...mindMapData });
  };

  const renderNode = (nodeData: NodeData): JSX.Element => {
    return (
      <Node
        nodeData={nodeData}
        setNodeDataText={setNodeDataText}
        processChangingNodeDataText={processChangingNodeDataText}
      />
    );
  };

  const renderNodes = (children: Children): JSX.Element[] => {
    const nodes = children.list.map((child) => renderNode(child));
    const childNodes = children.list.flatMap((child) =>
      renderNodes(child.children)
    );

    return nodes.concat(childNodes);
  };

  // TODO Why is display smaller on monitor?
  return (
    // TODO Resize when window size changes
    <PositionAdjuster top={top} left={left}>
      <Node
        nodeData={mindMapData.rootNodeData}
        setNodeDataText={setNodeDataText}
        processChangingNodeDataText={processChangingNodeDataText}
      />
      {renderNodes(mindMapData.rightMapData.nodes)}
    </PositionAdjuster>
  );
};

export default MindMap;
