import React, { useEffect, useRef, VFC } from "react";
import TextInputer from "~/components/atoms/TextInputer";
import NodeData from "~/domain/model/NodeData";
import { styled } from "@linaria/react";

type RootNodeProps = {
  nodeData: NodeData;
  setRootNodeDataText: (text: string) => void;
  processChangingRootNodeText: (width: number, height: number) => void;
};

type RootNodeDivProps = {
  top: number;
  left: number;
};

const RootNodeDiv = styled.div<RootNodeDivProps>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;

const RootNode: VFC<RootNodeProps> = (props) => {
  const rootNodeDivElement = useRef<HTMLDivElement>(null);

  const componentDidMount = () => {
    processChangingText();
  };

  const processChangingText = () => {
    rootNodeDivElement.current &&
      props.processChangingRootNodeText(
        rootNodeDivElement.current.offsetWidth,
        rootNodeDivElement.current.offsetHeight
      );
  };

  useEffect(componentDidMount, []);
  useEffect(processChangingText, [props.nodeData.text]);

  const handleTextInputerSetText = (text: string) => {
    rootNodeDivElement.current && props.setRootNodeDataText(text);
  };

  return (
    <RootNodeDiv
      ref={rootNodeDivElement}
      top={props.nodeData.top}
      left={props.nodeData.left}
    >
      <TextInputer
        text={props.nodeData.text}
        setText={handleTextInputerSetText}
      />
    </RootNodeDiv>
  );
};

export default RootNode;
