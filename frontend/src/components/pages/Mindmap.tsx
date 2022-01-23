import React, { FC, useState } from "react";
import { styled } from "@linaria/react";
import Node from "~/components/organisms/Node";
import RootNodeData, { newRootNodeData } from "~/domain/model/RootNodeData";
import { newNodeData } from "~/domain/model/NodeData";
import RootNode from "~/components/organisms/RootNode";
import { newRightNodesData } from "~/domain/model/RightNodesData";
import { newGroup } from "~/domain/model/Group";

type PositionWrapperStyleProps = {
  windowWidth: number;
  windowHeight: number;
};

const PositionWrapper = styled.div<PositionWrapperStyleProps>`
  position: absolute;
  top: ${(props) => props.windowHeight / 2}px;
  left: ${(props) => props.windowWidth / 2}px;
`;

const rootNodeDataObj = newRootNodeData(
  newNodeData("rootNode", "rootNode", newGroup(), []),
  newRightNodesData([
    newNodeData("id1 of right", "id1 of right", newGroup(), []),
    newNodeData("id2 of right", "id2 of right", newGroup(), []),
  ]),
  newRightNodesData([])
);

const Mindmap: FC = () => {
  const [rootNodeData, setRootNodeData] =
    useState<RootNodeData>(rootNodeDataObj);
  const [windowWidth] = useState<number>(window.innerWidth);
  const [windowHeight] = useState<number>(window.innerHeight);

  const setRootNodeDataText = (text: string) => {
    setRootNodeData({
      ...rootNodeData,
      param: { ...rootNodeData.param, text: text },
    });
  };

  const processChangingRootNodeText = (width: number, height: number) => {
    rootNodeData.processChangingText(width, height);
    setRootNodeData(rootNodeData);
  };

  const setNodeDataText = (id: string, text: string) => {
    rootNodeData.rightNodesData.setNodeTextById(id, text);
    setRootNodeData({ ...rootNodeData });
  };

  const processChangingNodeDataText = (
    id: string,
    width: number,
    height: number
  ) => {
    rootNodeData.rightNodesData.processChangingText(id, width, height);
    setRootNodeData({ ...rootNodeData });
  };

  return (
    // TODO Resize when window size changes
    <PositionWrapper
      id="PositionWrapper"
      windowWidth={windowWidth}
      windowHeight={windowHeight}
    >
      <RootNode
        nodeData={rootNodeData.param}
        setRootNodeDataText={setRootNodeDataText}
        processChangingRootNodeText={processChangingRootNodeText}
      />
      {rootNodeData.rightNodesData.list.map((nodeData) => (
        <Node
          key={nodeData.id}
          nodeData={nodeData}
          setNodeDataText={setNodeDataText}
          processChangingNodeDataText={processChangingNodeDataText}
        />
      ))}
    </PositionWrapper>
  );
};

export default Mindmap;
