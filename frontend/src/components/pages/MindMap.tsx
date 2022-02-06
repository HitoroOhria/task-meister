import React, { DragEvent, FC, useEffect, useRef, useState } from "react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import Node from "~/components/organisms/Node";
import Nodes from "~/components/organisms/Nodes";
import MindMapData, { newMindMapData } from "~/domain/model/MindMapData";
import { newRightNodesData } from "~/domain/model/RightMapData";
import { newNodeData } from "~/domain/model/NodeData";
import { newGroup } from "~/domain/model/Group";
import { newChildren } from "~/domain/model/Children";

const Origin = PositionAdjuster;

const node1_2_1 = newNodeData(
  "id1-2-1 of right",
  "id1-2-1 of right",
  newGroup(),
  newChildren([])
);
const node1_2_2 = newNodeData(
  "id1-2−2 of right",
  "id1-2-2 of right",
  newGroup(),
  newChildren([])
);
const node1_2_3 = newNodeData(
  "id1-2−3 of right",
  "id1-2-3 of right",
  newGroup(),
  newChildren([])
);

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
  newChildren([node1_2_1, node1_2_2, node1_2_3])
);
const node1_3 = newNodeData(
  "id1-3 of right",
  "id1-3 of right",
  newGroup(),
  newChildren([])
);

const node1 = newNodeData(
  "id1 of right",
  "id1 of right",
  newGroup(),
  newChildren([node1_1, node1_2, node1_3])
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
  const originElement = useRef<HTMLDivElement>(null);
  const [mindMapData, setMindMapData] = useState<MindMapData>(mindMapDataObj);
  const [originTop, setOriginTop] = useState<number>(window.innerHeight / 2);
  const [originLeft, setOriginLeft] = useState<number>(window.innerWidth / 2);

  const resetOrigin = () => {
    setOriginTop(window.innerHeight / 2);
    setOriginLeft(window.innerWidth / 2);
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

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (originElement.current == null) return;

    const originRect = originElement.current.getBoundingClientRect();
    const originX = window.scrollX + originRect.left;
    const originY = window.scrollY + originRect.top;

    const mouseTopFromOrigin = e.pageY - originY;
    const mouseLeftFromOrigin = e.pageX - originX;
    const nodeId = e.dataTransfer!.getData("text/plain");

    mindMapData.handleDropNode(nodeId, mouseTopFromOrigin, mouseLeftFromOrigin);
    setMindMapData({ ...mindMapData });
  };

  useEffect(componentDidMount, []);

  // TODO Why is display smaller on monitor?
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ width: window.innerWidth, height: window.innerHeight }}
    >
      <Origin ref={originElement} top={originTop} left={originLeft}>
        {/* TODO Make tail of root node to draggable */}
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
      </Origin>
    </div>
  );
};

export default MindMap;
