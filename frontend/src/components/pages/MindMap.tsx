import React, { FC, useEffect, useState } from "react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import Node from "~/components/organisms/Node";
import Nodes from "~/components/organisms/Nodes";
import MindMapData, { newMindMapData } from "~/domain/model/MindMapData";
import { newRightNodesData } from "~/domain/model/RightMapData";
import { newNodeData } from "~/domain/model/NodeData";
import { newGroup } from "~/domain/model/Group";
import { newChildren } from "~/domain/model/Children";

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
  const [originTop, setOriginTop] = useState<number>(window.innerHeight / 2);
  const [originLeft, setOrigintLeft] = useState<number>(window.innerWidth / 2);

  const resetOrigin = () => {
    setOriginTop(window.innerHeight / 2);
    setOrigintLeft(window.innerWidth / 2);
  };

  const componentDidMount = () => {
    window.onresize = resetOrigin;
  };

  const setNodeDataText = (id: string, text: string) => {
    mindMapData.setNodeTextById(id, text);
    setMindMapData({ ...mindMapData });
  };

  const handleNodeTextChanges = (id: string, width: number, height: number) => {
    mindMapData.handleTextChanges(id, width, height);
    setMindMapData({ ...mindMapData });
  };

  useEffect(componentDidMount, []);

  // TODO Why is display smaller on monitor?
  return (
    <PositionAdjuster top={originTop} left={originLeft}>
      <Node
        nodeData={mindMapData.rootNodeData}
        setNodeDataText={setNodeDataText}
        handleNodeTextChanges={handleNodeTextChanges}
      />
      <Nodes
        nodes={mindMapData.rightMapData.nodes}
        setNodeDataText={setNodeDataText}
        handleNodeTextChanges={handleNodeTextChanges}
      />
    </PositionAdjuster>
  );
};

export default MindMap;
