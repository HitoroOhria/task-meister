import React, { FC } from "react";
import { styled } from "@linaria/react";
import RootNode from "../organisms/RootNode";

type PositionWrapperProps = {
  windowWidth: number;
  windowHeight: number;
};

const PositionWrapper = styled.div<PositionWrapperProps>`
  position: absolute;
  top: ${(props) => props.windowHeight / 2};
  left: ${(props) => props.windowWidth / 2};
`;

const Mindmap: FC = () => {
  const windowWidth: number = window.innerWidth;
  const windowHeight: number = window.innerHeight;

  return (
    <PositionWrapper
      id="PositionWrapper"
      windowWidth={windowWidth}
      windowHeight={windowHeight}
    >
      <RootNode />
    </PositionWrapper>
  );
};

export default Mindmap;
