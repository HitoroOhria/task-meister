import React, {useContext, useEffect, useRef, VFC} from "react";
import {styled} from "@linaria/react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import DraggableElement from "~/components/organisms/DraggableElement";
import TextInputer, {elementSizeCalculator, minWidthPx as TextInputerMinWidth,} from "~/components/atoms/TextInputer";
import {mindMapDataActionType as actionType} from "~/store/reducer/MindMapDataReducer";
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
  node: NodeData;
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
      type: actionType.setNodeText,
      payload: {
        id: props.node.id,
        text,
      },
    });
  };

  // Do not use value of element. (ex. innerHeight, offsetHeight)
  // Because getting process ends before dom rendered. and the value of the previous text is acquired.
  // So, get previous value
  const handleNodeTextChanges = () => {
    const textWidth =
      // TODO Set Prettier config
      elementSizeCalculator.measureLongestLineWidth(props.node.text) <
      TextInputerMinWidth
        ? TextInputerMinWidth
        : elementSizeCalculator.measureLongestLineWidth(props.node.text);
    const width = borderWidth * 2 + insideWidthOfTextarea + textWidth;
    const height =
      borderWidth * 2 +
      nodeHeightWhenOneLine +
      heightPerOneLine * (numberOfLines(props.node.text) - 1);

    dispatchMindMapData({
      type: actionType.processNodeTextChanges,
      payload: {
        id: props.node.id,
        width,
        height,
      },
    });
  };

  const handleDoubleClick = () => {
    dispatchMindMapData({
      type: actionType.setNodeIsInputting,
      payload: {
        id: props.node.id,
        isInputting: true,
      },
    });
    dispatchMindMapData({
      type: actionType.setGlobalIsInputting,
      payload: { isInputting: true },
    });
  };

  const handleBlur = () => {
    dispatchMindMapData({
      type: actionType.setNodeIsInputting,
      payload: {
        id: props.node.id,
        isInputting: false,
      },
    });
    dispatchMindMapData({
      type: actionType.setGlobalIsInputting,
      payload: { isInputting: false },
    });
  };

  const componentDidMount = () => {
    handleNodeTextChanges();
  };

  useEffect(componentDidMount, []);
  useEffect(handleNodeTextChanges, [props.node.text]);

  return (
    <PositionAdjuster top={props.node.top} left={props.node.left}>
      <DraggableElement textData={props.node.id}>
        <NodeDiv
          ref={nodeDivElement}
          hidden={props.node.isHidden}
          borderColor={props.node.isSelected ? "yellow" : "blue"}
          onClick={() =>
            dispatchMindMapData({
              type: actionType.selectNode,
              payload: { id: props.node.id },
            })
          }
        >
          <TextInputer
            text={props.node.text}
            setText={handleSetText}
            isInputting={props.node.isInputting}
            handleDoubleClick={handleDoubleClick}
            handleBlur={handleBlur}
          />
        </NodeDiv>
      </DraggableElement>
    </PositionAdjuster>
  );
};

export default Node;
