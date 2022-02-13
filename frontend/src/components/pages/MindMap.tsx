import React, { useContext, VFC } from "react";
import DroppableArea from "~/components/organisms/DroppableArea";
import Origin from "~/components/organisms/Origin";
import Node from "~/components/organisms/Node";
import Nodes from "~/components/organisms/Nodes";
import { MindMapStateCtx } from "~/store/context/MindMapDataCtx";
import KeydownManager from "~/components/organisms/KeydownManager";

const MindMap: VFC = () => {
  const mindMapData = useContext(MindMapStateCtx);

  // TODO Why is display smaller on monitor?
  return (
    <>
      <KeydownManager />
      <DroppableArea>
        <Origin>
          {/* TODO Make tail of root node to draggable */}
          <Node nodeData={mindMapData.rootNode} />
          <Nodes nodes={mindMapData.rightMap.children} />
        </Origin>
      </DroppableArea>
    </>
  );
};

export default MindMap;
