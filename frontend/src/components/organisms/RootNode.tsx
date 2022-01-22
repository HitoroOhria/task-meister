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
  position: relative;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;

const RootNode: VFC<RootNodeProps> = (props) => {
  const rootNodeDivElement = useRef<HTMLDivElement>(null);

  const componentDidMount = () => {
    processChangingText();
  };

  const processChangingText = () => {
    if (rootNodeDivElement.current == null) {
      return;
    }

    const width = rootNodeDivElement.current.offsetWidth;
    const height = rootNodeDivElement.current.offsetHeight;

    props.processChangingRootNodeText(width, height);
  };

  useEffect(componentDidMount, []);
  useEffect(processChangingText, [props.nodeData.text]);

  const handleTextInputerSetText = (text: string) => {
    rootNodeDivElement.current && props.setRootNodeDataText(text);
  };

  return (
    <RootNodeDiv
      ref={rootNodeDivElement}
      top={props.nodeData.nodeTop}
      left={props.nodeData.nodeLeft}
    >
      <TextInputer
        text={props.nodeData.text}
        setText={handleTextInputerSetText}
      />
    </RootNodeDiv>
  );
};

export default RootNode;
