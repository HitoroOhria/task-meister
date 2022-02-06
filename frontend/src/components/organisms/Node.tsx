import React, {useEffect, useRef, VFC} from "react";
import NodeData from "~/domain/model/NodeData";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import TextInputer, {elementSizeCalculator,} from "~/components/atoms/TextInputer";
import {numberOfLines} from "~/util/StringUtil";

// width of textarea from border to text
// values of below is average of measured values
const insideWidthOfTextarea = 40.75;
const nodeHeightWhenOneLine = 62;
const heightPerOneLine = 13;

type NodeProps = {
  nodeData: NodeData;
  setNodeDataText: (id: string, text: string) => void;
  handleNodeTextChanges: (id: string, width: number, height: number) => void;
};

const Node: VFC<NodeProps> = (props) => {
  const nodeDivElement = useRef<HTMLDivElement>(null);

  const componentDidMount = () => {
    handleNodeTextChanges();
  };

  const handleSetText = (text: string) => {
    nodeDivElement.current && props.setNodeDataText(props.nodeData.id, text);
  };

  // Do not use value of element. (ex. innerHeight, offsetHeight)
  // Because getting process ends before dom rendered. and the value of the previous text is acquired.
  // So, get previous value
  const handleNodeTextChanges = () => {
    const width =
      insideWidthOfTextarea +
      elementSizeCalculator.measureLongestLineWidth(props.nodeData.text);
    const height =
      nodeHeightWhenOneLine +
      heightPerOneLine * (numberOfLines(props.nodeData.text) - 1);

    props.handleNodeTextChanges(props.nodeData.id, width, height);
  };

  useEffect(componentDidMount, []);
  useEffect(handleNodeTextChanges, [props.nodeData.text]);

  return (
    <PositionAdjuster
      ref={nodeDivElement}
      top={props.nodeData.top}
      left={props.nodeData.left}
    >
      <TextInputer text={props.nodeData.text} setText={handleSetText} />
    </PositionAdjuster>
  );
};

export default Node;
