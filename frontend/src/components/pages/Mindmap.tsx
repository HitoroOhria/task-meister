import React, { FC, useState } from "react";
import { styled } from "@linaria/react";
import RootNode from "../organisms/RootNode";

type PositionWrapperProps = {
  windowWidth: number;
  windowHeight: number;
};

type inputtingRootNodeIdType = string | null;

const PositionWrapper = styled.div<PositionWrapperProps>`
  position: absolute;
  top: ${(props) => props.windowHeight / 2}px;
  left: ${(props) => props.windowWidth / 2}px;
`;

const Mindmap: FC = () => {
  const [rootNodeIsInput, setRootNodeIsInput] = useState<boolean>(false);
  const [rootNodeText, setRootNodeText] = useState<string>("");
  const [inputtingRootNodeId, setInputtingRootNodeId] =
    useState<inputtingRootNodeIdType>(null);

  const id = "PositionWrapper";
  let clickListener: () => void;

  const handleRootNodeTextChange = (text: string) => {
    setRootNodeText(text);
  };
  const handleRooNodeDoubleClick = (targetId: string) => {
    setRootNodeIsInput(!rootNodeIsInput);
    setInputtingRootNodeId(targetId);
    clickListener = () => handleRooNode(targetId);
    document.addEventListener("click", clickListener);
  };

  const handleRooNodeClick = () => {
    console.log("called handleRooNodeClick");
  };

  const handleRooNode = (inputtingRootNodeId: inputtingRootNodeIdType) => {
    if (inputtingRootNodeId === null) {
      return;
    }

    const isInputtingRootNodeClick: boolean = !!document
      .getElementById(inputtingRootNodeId)!
      .closest<HTMLElementTagNameMap["textarea"]>("#" + inputtingRootNodeId);
    if (!isInputtingRootNodeClick) {
      setRootNodeIsInput(false);
      setInputtingRootNodeId(null);
      document.removeEventListener("click", clickListener);
    }
  };

  const windowWidth: number = window.innerWidth;
  const windowHeight: number = window.innerHeight;

  return (
    <PositionWrapper
      id={id}
      windowWidth={windowWidth}
      windowHeight={windowHeight}
    >
      <RootNode
        isInput={rootNodeIsInput}
        text={rootNodeText}
        handleTextChange={handleRootNodeTextChange}
        handleDoubleClick={handleRooNodeDoubleClick}
        handleClick={handleRooNodeClick}
      />
    </PositionWrapper>
  );
};

export default Mindmap;
