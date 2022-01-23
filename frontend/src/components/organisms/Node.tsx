import React, { useEffect, useRef, VFC } from "react";
import { styled } from "@linaria/react";
import NodeData from "~/domain/model/NodeData";
import TextInputer from "~/components/atoms/TextInputer";

type NodeProps = {
  nodeData: NodeData;
  setNodeDataText: (id: string, text: string) => void;
  processChangingNodeDataText: (
    id: string,
    width: number,
    height: number
  ) => void;
};

type NodeDivProps = {
  top: number;
  left: number;
};

const NodeDiv = styled.div<NodeDivProps>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;

const Node: VFC<NodeProps> = (props) => {
  const nodeDivElement = useRef<HTMLDivElement>(null);

  const componentDidMount = () => {
    processChangingNodeDataText();
  };

  const handleTextInputerSetText = (text: string) => {
    nodeDivElement.current && props.setNodeDataText(props.nodeData.id, text);
  };

  const processChangingNodeDataText = () => {
    nodeDivElement.current &&
      props.processChangingNodeDataText(
        props.nodeData.id,
        nodeDivElement.current.offsetWidth,
        nodeDivElement.current.offsetHeight
      );
  };

  useEffect(componentDidMount, []);
  useEffect(processChangingNodeDataText, [props.nodeData.text]);

  return (
    <NodeDiv
      ref={nodeDivElement}
      top={props.nodeData.top}
      left={props.nodeData.left}
    >
      <TextInputer
        text={props.nodeData.text}
        setText={handleTextInputerSetText}
      />
    </NodeDiv>
  );
};

export default Node;
