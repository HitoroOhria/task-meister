import React, {useContext, useEffect, useRef, VFC} from "react";
import {styled} from "@linaria/react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import DraggableElement from "~/components/organisms/DraggableElement";
import TextInputer, {elementSizeCalculator, lineHeight, minWidth,} from "~/components/atoms/TextInputer";
import {mindMapDataActionType as actionType} from "~/store/reducer/MindMapDataReducer";
import {MindMapDispatchCtx} from "~/store/context/MindMapDataCtx";
import NodeData from "~/domain/model/NodeData";
import {numberOfLines} from "~/util/StringUtil";

// width of textarea from border to text
// values of below is average of measured values
const borderWidth = 5;
// one of vertical margin. unit is px.
const verticalMargin = 15;
// one of horizontal margin. unit is px.
const horizontalMargin = 30;
// padding of css. unit is px.
const padding = 20;

type Props = {
  node: NodeData;
};

const Node: VFC<Props> = (props) => {
  const nodeDivElement = useRef<HTMLDivElement>(null);
  const dispatchMindMapData = useContext(MindMapDispatchCtx);

  const handleNodeTextChanges = (text: string) => {
    if (text.slice(-1) === "\n") {
      outInputting();
      return;
    }

    replaceNodes(text);
  };

  // TODO Move to useCase and responds Shift + Enter to new line.
  // Do not use value of element. (ex. innerHeight, offsetHeight)
  // Because getting process ends before dom rendered. and the value of the previous text is acquired.
  // So, get previous value
  const replaceNodes = (text: string) => {
    const textWidth =
      // TODO Set Prettier config
      elementSizeCalculator.measureLongestLineWidth(text) < minWidth
        ? minWidth
        : elementSizeCalculator.measureLongestLineWidth(text);
    const width =
      horizontalMargin * 2 + borderWidth * 2 + padding * 2 + textWidth;
    const textHeight = lineHeight * numberOfLines(text);
    const height =
      verticalMargin * 2 + borderWidth * 2 + padding * 2 + textHeight;

    dispatchMindMapData({
      type: actionType.processNodeTextChanges,
      payload: {
        id: props.node.id,
        text,
        width,
        height,
      },
    });
  };

  const handleClick = () => {
    if (props.node.isSelected) return;

    dispatchMindMapData({
      type: actionType.selectNode,
      payload: { id: props.node.id },
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

  // TODO Is this unnecessary?
  //   - Maybe can implement only selectNode
  const outInputting = () => {
    // When added Node by Enter.
    if (!props.node.isSelected) return;

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
    replaceNodes(props.node.text);
  };

  useEffect(componentDidMount, []);

  return (
    <PositionAdjuster top={props.node.top} left={props.node.left}>
      <DraggableElement textData={props.node.id}>
        <NodeDiv
          ref={nodeDivElement}
          hidden={props.node.isHidden}
          borderColor={props.node.isSelected ? "yellow" : "blue"}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <TextInputer
            text={props.node.text}
            setText={(text) => handleNodeTextChanges(text)}
            isInputting={props.node.isInputting}
            handleBlur={outInputting}
          />
        </NodeDiv>
      </DraggableElement>
    </PositionAdjuster>
  );
};

export default Node;

type NodeDivProps = {
  hidden: boolean;
  borderColor: string;
};

const NodeDiv = styled.div<NodeDivProps>`
  display: ${(props) => (props.hidden ? "none" : "block")};
  margin: ${verticalMargin}px ${horizontalMargin}px;
  padding: ${padding}px;
  border: thick solid ${(props) => props.borderColor};
  border-radius: 10px;
  background-color: gray;
`;
