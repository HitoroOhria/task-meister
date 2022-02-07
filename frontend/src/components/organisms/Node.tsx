import React, {useEffect, useRef, VFC} from "react";
import {styled} from "@linaria/react";
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

type NodeDivProps = {
  hidden: boolean;
};

const NodeDiv = styled.div<NodeDivProps>`
  display: ${(props) => (props.hidden ? "none" : "block")};
`;

const Node: VFC<NodeProps> = (props) => {
  const nodeDivElement = useRef<HTMLDivElement>(null);

  const handleSetText = (text: string) => {
    props.setNodeDataText(props.nodeData.id, text);
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

  const addDragEventListener = () => {
    nodeDivElement.current &&
      nodeDivElement.current.addEventListener("dragstart", handleDragStart);
  };

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer && e.dataTransfer.setData("text/plain", props.nodeData.id);
  };

  const componentDidMount = () => {
    handleNodeTextChanges();
    addDragEventListener();
  };

  useEffect(componentDidMount, []);
  useEffect(handleNodeTextChanges, [props.nodeData.text]);

  return (
    // TODO Make TextInputer draggable
    <NodeDiv
      ref={nodeDivElement}
      draggable={"true"}
      hidden={props.nodeData.isHidden}
    >
      <PositionAdjuster top={props.nodeData.top} left={props.nodeData.left}>
        <TextInputer text={props.nodeData.text} setText={handleSetText} />
      </PositionAdjuster>
    </NodeDiv>
  );
};

export default Node;
