import React, { FC, useState } from "react";
import { styled } from "@linaria/react";
import Node from "../organisms/Node";

type PositionWrapperStyleProps = {
  windowWidth: number;
  windowHeight: number;
};

const PositionWrapper = styled.div<PositionWrapperStyleProps>`
  position: absolute;
  top: ${(props) => props.windowHeight / 2}px;
  left: ${(props) => props.windowWidth / 2}px;
`;

const Mindmap: FC = () => {
  const [windowWidth] = useState<number>(window.innerWidth);
  const [windowHeight] = useState<number>(window.innerHeight);

  return (
    // TODO Resize when window size changes
    <PositionWrapper
      id="PositionWrapper"
      windowWidth={windowWidth}
      windowHeight={windowHeight}
    >
      {[...Array(1)].map(() => (
        <Node />
      ))}
    </PositionWrapper>
  );
};

export default Mindmap;
