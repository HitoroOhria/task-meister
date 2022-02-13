import React, { VFC } from "react";
import MindMapDataProvider from "~/store/provider/MindMapDataProvider";
import OriginPointProvider from "~/store/provider/OriginPointProvider";
import MindMap from "~/components/pages/MindMap";

const MindMapPage: VFC = () => {
  return (
    <OriginPointProvider>
      <MindMapDataProvider>
        <MindMap />
      </MindMapDataProvider>
    </OriginPointProvider>
  );
};

export default MindMapPage;
