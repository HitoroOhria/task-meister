import React, { useEffect, useRef, VFC } from "react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import TextInputer, {
  elementSizeCalculator,
} from "~/components/atoms/TextInputer";
import NodeData from "~/domain/model/NodeData";
import { numberOfLines } from "~/util/StringUtil";

type RootNodeProps = {
  nodeData: NodeData;
  setmindMapDataText: (text: string) => void;
  processChangingRootNodeText: (width: number, height: number) => void;
};

// width of textarea from border to text
// values of below is average of measured values
const insideWidthOfTextarea = 40.75;
const nodeHeightWhenOneLine = 62;
const heightPerOneLine = 23;

const RootNode: VFC<RootNodeProps> = (props) => {
  const rootNodeDivElement = useRef<HTMLDivElement>(null);

  const componentDidMount = () => {
    processChangingText();
  };

  // Do not use value of element. (ex. innerHeight, offsetHeight)
  // Because getting process ends before dom rendered. and the value of the previous text is acquired.
  // So, get previous value
  const processChangingText = () => {
    if (rootNodeDivElement.current == null) {
      return;
    }

    const width =
      insideWidthOfTextarea +
      elementSizeCalculator.measureWidth(props.nodeData.text);
    const height =
      nodeHeightWhenOneLine +
      heightPerOneLine * numberOfLines(props.nodeData.text);

    props.processChangingRootNodeText(width, height);
  };

  useEffect(componentDidMount, []);
  useEffect(processChangingText, [props.nodeData.text]);

  const handleTextInputerSetText = (text: string) => {
    rootNodeDivElement.current && props.setmindMapDataText(text);
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
