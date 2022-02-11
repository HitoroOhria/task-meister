import React, {useEffect, useRef, VFC} from "react";
import {styled} from "@linaria/react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import TextInputer, {elementSizeCalculator,} from "~/components/atoms/TextInputer";
import NodeData from "~/domain/model/NodeData";
import {numberOfLines} from "~/util/StringUtil";

// width of textarea from border to text
// values of below is average of measured values
const borderWidth = 5;
const insideWidthOfTextarea = 40.75;
const nodeHeightWhenOneLine = 62;
const heightPerOneLine = 13;

type NodeProps = {
  nodeData: NodeData;
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  setIsInputting: (isInputting: boolean) => void;
  setNodeDataText: (id: string, text: string) => void;
  handleNodeTextChanges: (id: string, width: number, height: number) => void;
};

type NodeDivProps = {
  hidden: boolean;
  borderColor: string;
};

const NodeDiv = styled.div<NodeDivProps>`
  display: ${(props) => (props.hidden ? "none" : "block")};
  border: thick solid ${(props) => props.borderColor};
  border-radius: 10px;
  background-color: gray;
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
      borderWidth * 2 +
      insideWidthOfTextarea +
      elementSizeCalculator.measureLongestLineWidth(props.nodeData.text);
    const height =
      borderWidth * 2 +
      nodeHeightWhenOneLine +
      heightPerOneLine * (numberOfLines(props.nodeData.text) - 1);

    props.handleNodeTextChanges(props.nodeData.id, width, height);
  };

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer && e.dataTransfer.setData("text/plain", props.nodeData.id);
  };

  const addDragEventListener = () => {
    nodeDivElement.current &&
      nodeDivElement.current.addEventListener("dragstart", handleDragStart);
  };

  const componentDidMount = () => {
    handleNodeTextChanges();
    addDragEventListener();
  };

  useEffect(componentDidMount, []);
  useEffect(handleNodeTextChanges, [props.nodeData.text]);

  return (
    <PositionAdjuster top={props.nodeData.top} left={props.nodeData.left}>
      {/* TODO Make TextInputer draggable*/}
      <NodeDiv
        ref={nodeDivElement}
        hidden={props.nodeData.isHidden}
        borderColor={
          props.selectedNodeId === props.nodeData.id ? "yellow" : "blue"
        }
        onClick={() => props.setSelectedNodeId(props.nodeData.id)}
        draggable={"true"}
      >
        <TextInputer
          text={props.nodeData.text}
          setText={handleSetText}
          setGlobalIsInputting={props.setIsInputting}
        />
      </NodeDiv>
    </PositionAdjuster>
  );
};

export default Node;
