import React, { FC, useState } from "react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import Node from "~/components/organisms/Node";
import MindMapData, { newMindMapData } from "~/domain/model/MindMapData";
import { newRightNodesData } from "~/domain/model/RightMapData";
import { newNodeData } from "~/domain/model/NodeData";
import { newGroup } from "~/domain/model/Group";
import { newChildren } from "~/domain/model/Children";

const mindMapDataObj = newMindMapData(
  newNodeData("rootNode", "rootNode", newGroup(), newChildren([])),
  newRightNodesData(
    newChildren([
      newNodeData("id1 of right", "id1 of right", newGroup(), newChildren([])),
      newNodeData("id2 of right", "id2 of right", newGroup(), newChildren([])),
    ])
  ),
  newRightNodesData(newChildren([]))
);

const MindMap: FC = () => {
  const [mindMapData, setMindMapData] = useState<MindMapData>(mindMapDataObj);
  const [top] = useState<number>(window.innerWidth / 2);
  const [left] = useState<number>(window.innerHeight / 2);

  const setNodeDataText = (id: string, text: string) => {
    mindMapData.setNodeTextById(id, text);
    setMindMapData({ ...mindMapData });
  };

  const processChangingNodeDataText = (
    id: string,
    width: number,
    height: number
  ) => {
    mindMapData.processChangingText(id, width, height);
    setMindMapData({ ...mindMapData });
  };

  return (
    // TODO Resize when window size changes
    <PositionAdjuster top={top} left={left}>
      <Node
        nodeData={mindMapData.rootNodeData}
        setNodeDataText={setNodeDataText}
        processChangingNodeDataText={processChangingNodeDataText}
      />
      {mindMapData.rightMapData.nodes.list.map((nodeData) => (
        <Node
          key={nodeData.id}
          nodeData={nodeData}
          setNodeDataText={setNodeDataText}
          processChangingNodeDataText={processChangingNodeDataText}
        />
      ))}
    </PositionAdjuster>
  );
};

export default MindMap;
