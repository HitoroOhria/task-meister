import React, {useContext, useEffect, useRef, VFC} from "react";
import {styled} from "@linaria/react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import TextInputer, {elementSizeCalculator, minWidthPx as TextInputerMinWidth,} from "~/components/atoms/TextInputer";
import NodeData from "~/domain/model/NodeData";
import {numberOfLines} from "~/util/StringUtil";
import {MindMapDispatchCtx} from "~/store/context/MindMapDataCtx";

// width of textarea from border to text
// values of below is average of measured values
const borderWidth = 5;
const insideWidthOfTextarea = 40.75; // TODO Maybe this is padding of TextInputer
const nodeHeightWhenOneLine = 62;
const heightPerOneLine = 13;

type NodeProps = {
  nodeData: NodeData;
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
  const dispatchMindMapData = useContext(MindMapDispatchCtx);

  // Do not use value of element. (ex. innerHeight, offsetHeight)
  // Because getting process ends before dom rendered. and the value of the previous text is acquired.
  // So, get previous value
  const handleNodeTextChanges = () => {
    const textWidth =
      // TODO Set Prettier config
      elementSizeCalculator.measureLongestLineWidth(props.nodeData.text) <
      TextInputerMinWidth
        ? TextInputerMinWidth
        : elementSizeCalculator.measureLongestLineWidth(props.nodeData.text);
    const width = borderWidth * 2 + insideWidthOfTextarea + textWidth;
    const height =
      borderWidth * 2 +
      nodeHeightWhenOneLine +
      heightPerOneLine * (numberOfLines(props.nodeData.text) - 1);

    dispatchMindMapData({
      type: "handleNodeTextChanges",
      id: props.nodeData.id,
      width,
      height,
    });
  };

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer!.setData("text/plain", props.nodeData.id);
  };

  const addDragEventListener = () => {
    nodeDivElement.current!.addEventListener("dragstart", handleDragStart);
  };

  const componentDidMount = () => {
    handleNodeTextChanges();
    addDragEventListener();
  };

  useEffect(componentDidMount, []);
  useEffect(handleNodeTextChanges, [props.nodeData.text]);

  const handleSetText = (text: string) => {
    dispatchMindMapData({
      type: "setNodeText",
      id: props.nodeData.id,
      text,
    });
  };

  return (
    <PositionAdjuster top={props.nodeData.top} left={props.nodeData.left}>
      {/* TODO Make TextInputer draggable*/}
      <NodeDiv
        ref={nodeDivElement}
        hidden={props.nodeData.isHidden}
        borderColor={props.nodeData.isSelected ? "yellow" : "blue"}
        onClick={() =>
          dispatchMindMapData({ type: "selectNode", id: props.nodeData.id })
        }
        draggable={"true"}
      >
        <TextInputer text={props.nodeData.text} setText={handleSetText} />
      </NodeDiv>
    </PositionAdjuster>
  );
};

export default Node;
