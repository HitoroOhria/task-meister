import React, {useEffect, useRef, VFC} from "react";
import NodeData from "~/domain/model/NodeData";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import TextInputer, {elementSizeCalculator,} from "~/components/atoms/TextInputer";
import {numberOfLines} from "~/util/StringUtil";

// width of textarea from border to text
// values of below is average of measured values
const insideWidthOfTextarea = 40.75;
const nodeHeightWhenOneLine = 62;
const heightPerOneLine = 23;

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

  // Do not use value of element. (ex. innerHeight, offsetHeight)
  // Because getting process ends before dom rendered. and the value of the previous text is acquired.
  // So, get previous value
  const processChangingNodeDataText = () => {
    const width =
      insideWidthOfTextarea +
      elementSizeCalculator.measureWidth(props.nodeData.text);
    const height =
      nodeHeightWhenOneLine +
      heightPerOneLine * numberOfLines(props.nodeData.text);

    props.processChangingNodeDataText(props.nodeData.id, width, height);
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
