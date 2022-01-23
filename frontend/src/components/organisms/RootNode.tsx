import React, { useEffect, useRef, VFC } from "react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import TextInputer from "~/components/atoms/TextInputer";
import NodeData from "~/domain/model/NodeData";

type RootNodeProps = {
  nodeData: NodeData;
  setRootNodeDataText: (text: string) => void;
  processChangingRootNodeText: (width: number, height: number) => void;
};

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
    <PositionAdjuster
      ref={rootNodeDivElement}
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

export default RootNode;
