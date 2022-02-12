import React, { VFC } from "react";
import MindMapDataProvider from "~/store/provider/MindMapDataProvider";
import MindMap from "~/components/pages/MindMap";

const MindMapPage: VFC = () => {
  return (
    <MindMapDataProvider>
      <MindMap />
    </MindMapDataProvider>
  );
};

export default MindMapPage;
