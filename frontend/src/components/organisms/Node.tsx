import React, { useEffect, useRef, VFC } from "react";
import NodeData from "~/domain/model/NodeData";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
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
    <PositionAdjuster
      ref={nodeDivElement}
      top={props.nodeData.top}
      left={props.nodeData.left}
    >
      <TextInputer
        text={props.nodeData.text}
        setText={handleTextInputerSetText}
      />
    </PositionAdjuster>
  );
};

export default Node;
