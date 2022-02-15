import React, { useContext, VFC } from "react";
import DroppableArea from "~/components/organisms/DroppableArea";
import Origin from "~/components/organisms/Origin";
import Node from "~/components/organisms/Node";
import Nodes from "~/components/organisms/Nodes";
import { MindMapStateCtx } from "~/store/context/MindMapDataCtx";
import KeydownManager from "~/components/organisms/KeydownManager";
import { styled } from "@linaria/react";

const MindMap: VFC = () => {
  const mindMapData = useContext(MindMapStateCtx);

  // TODO Why is display smaller on monitor?
  return (
    <>
      {/*<Textarea>textarea</Textarea>*/}
      {/*<Span>span</Span>*/}
      <KeydownManager />
      <DroppableArea>
        <Origin>
          {/* TODO Make tail of root node to draggable */}
          <Node node={mindMapData.rootNode} />
          <Nodes nodes={mindMapData.rightMap.children} />
        </Origin>
      </DroppableArea>
    </>
  );
};

export default MindMap;

const Span = styled.span`
  background-color: yellow;
  display: block;
  text-align: center;
`;

const Textarea = styled.textarea`
  background-color: red;
  outline: none;
  resize: none;
  overflow: hidden;
`;
