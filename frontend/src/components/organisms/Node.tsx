import React, {useContext, useEffect, useRef, VFC} from "react";
import {styled} from "@linaria/react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import DraggableElement from "~/components/organisms/DraggableElement";
import TextInputer, {elementSizeCalculator, minWidthPx as TextInputerMinWidth,} from "~/components/atoms/TextInputer";
import {MindMapDispatchCtx} from "~/store/context/MindMapDataCtx";
import NodeData from "~/domain/model/NodeData";
import {numberOfLines} from "~/util/StringUtil";

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

  const handleSetText = (text: string) => {
    dispatchMindMapData({
      type: "setNodeText",
      id: props.nodeData.id,
      text,
    });
  };

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
      type: "processNodeTextChanges",
      id: props.nodeData.id,
      width,
      height,
    });
  };

  const handleDoubleClick = () => {
    dispatchMindMapData({
      type: "setNodeIsInputting",
      id: props.nodeData.id,
      isInputting: true,
    });
    dispatchMindMapData({ type: "setGlobalIsInputting", isInputting: true });
  };

  const handleBlur = () => {
    dispatchMindMapData({
      type: "setNodeIsInputting",
      id: props.nodeData.id,
      isInputting: false,
    });
    dispatchMindMapData({ type: "setGlobalIsInputting", isInputting: false });
  };

  const componentDidMount = () => {
    handleNodeTextChanges();
  };

  useEffect(componentDidMount, []);
  useEffect(handleNodeTextChanges, [props.nodeData.text]);

  return (
    <PositionAdjuster top={props.nodeData.top} left={props.nodeData.left}>
      <DraggableElement textData={props.nodeData.id}>
        <NodeDiv
          ref={nodeDivElement}
          hidden={props.nodeData.isHidden}
          borderColor={props.nodeData.isSelected ? "yellow" : "blue"}
          onClick={() =>
            dispatchMindMapData({ type: "selectNode", id: props.nodeData.id })
          }
        >
          <TextInputer
            text={props.nodeData.text}
            setText={handleSetText}
            isInputting={props.nodeData.isInputting}
            handleDoubleClick={handleDoubleClick}
            handleBlur={handleBlur}
          />
        </NodeDiv>
      </DraggableElement>
    </PositionAdjuster>
  );
};

export default Node;
