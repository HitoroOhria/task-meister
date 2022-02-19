import React, {useEffect, useRef, useState, VFC} from "react";
import {styled} from "@linaria/react";
import ElementSizeCalculator from "~/util/ElementSizeCalculator";
import {numberOfLines} from "~/util/StringUtil";

// minimum width of css. unit is px.
export const minWidth = 50;
// line height of css. unit is px.
export const lineHeight = 18;
// font size of css. unit is px.
const fontSize = 15;
const fontFamily = "monospace";
const font = `${fontSize}px ${fontFamily}`;

// const
// For measure text width
export const elementSizeCalculator = new ElementSizeCalculator(font);

type Props = {
  text: string;
  isInputting: boolean;
  setText: (text: string) => void;
  handleBlur: () => void;
};

const TextInputer: VFC<Props> = (props) => {
  const textareaElement = useRef<HTMLTextAreaElement>(null);
  const [textWidth, setTextWidth] = useState<number>(0);
  const [textHeight, setTextHeight] = useState<number>(0);

  const handleTextChanges = () => {
    // TODO Can refactor to use BoundingClientRect?
    //   - see https://developer.mozilla.org/ja/docs/Web/API/Element/getBoundingClientRect
    updateTextWidth();
    updateTextHeight();
  };

  const updateTextWidth = () => {
    const textElementWidth = Math.ceil(
      elementSizeCalculator.measureLongestLineWidth(props.text)
    );
    const textWidth = minWidth < textElementWidth ? textElementWidth : minWidth;

    setTextWidth(textWidth);
  };

  const updateTextHeight = () => {
    // TODO Maybe height changes depending on resolution of display
    const textHeight = numberOfLines(props.text) * lineHeight;

    setTextHeight(textHeight);
  };

  const moveCaretToEnd = () => {
    if (!textareaElement.current) return;

    textareaElement.current!.selectionStart = props.text.length;
    textareaElement.current!.selectionEnd = props.text.length;
  };

  // TODO Refactor around focus and blur.
  const isInputtingEffect = () => {
    if (!textareaElement.current) return;

    props.isInputting
      ? textareaElement.current.focus()
      : textareaElement.current.blur();
  };

  const componentDidMount = () => {
    updateTextWidth();
    updateTextHeight();
  };

  useEffect(componentDidMount, []);
  useEffect(handleTextChanges, [props.text]);
  useEffect(isInputtingEffect, [props.isInputting]);

  return (
    // TODO Eliminate range selection after double-clicking
    <TopDiv width={textWidth} height={textHeight}>
      {props.isInputting ? (
        <Textarea
          ref={textareaElement}
          defaultValue={props.text}
          onChange={(e) => props.setText(e.target.value)}
          onFocus={moveCaretToEnd}
          onBlur={props.handleBlur}
        />
      ) : (
        // TODO Why text is out of Node when expanded?
        <SpanInlineBlock>{props.text}</SpanInlineBlock>
      )}
    </TopDiv>
  );
};

export default TextInputer;

type TopDivProps = {
  // unit is px.
  width: number;
  // unit is px.
  height: number;
};

const TopDiv = styled.div<TopDivProps>`
  min-width: ${minWidth}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  font: ${font};
  line-height: ${lineHeight}px;
`;

const Textarea = styled.textarea`
  padding: 0px;
  min-width: inherit;
  width: inherit;
  height: inherit;
  font: inherit;
  border-width: 0px;
  background-color: gray;
  outline: none;
  resize: none;
  overflow: hidden;
`;

const SpanInlineBlock = styled.span`
  min-width: inherit;
  width: inherit;
  height: inherit;
  font: inherit;
  display: inline-block;
`;
