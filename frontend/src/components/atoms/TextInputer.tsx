import React, {useEffect, useRef, useState, VFC} from "react";
import {styled} from "@linaria/react";
import ElementSizeCalculator from "~/util/ElementSizeCalculator";
import {numberOfLines} from "~/util/StringUtil";

// CSS
export const minWidthPx = 50;
const lineHeightEm = 1;
// font size. unit is px.
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
  const [textareaWidthPx, setTextareaWidthPx] = useState<number>(0);
  const [textareaHeightEm, setTextareaHeightEm] = useState<number>(0);

  const handleTextChanges = () => {
    // TODO Can refactor to use BoundingClientRect?
    //   - see https://developer.mozilla.org/ja/docs/Web/API/Element/getBoundingClientRect
    updateTextareaWidth();
    updateTextareaHeight();
  };

  const updateTextareaWidth = () => {
    if (textareaElement.current === null) return;

    const textWidth = Math.ceil(
      elementSizeCalculator.measureLongestLineWidth(props.text)
    );
    const textareaWidth = minWidthPx < textWidth ? textWidth : minWidthPx;

    setTextareaWidthPx(textareaWidth);
  };

  const updateTextareaHeight = () => {
    // TODO Maybe height changes depending on resolution of display
    const heightEm = numberOfLines(props.text) * lineHeightEm;
    setTextareaHeightEm(heightEm);
  };

  const handleFocus = () => {
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
    updateTextareaWidth();
    updateTextareaHeight();
  };

  useEffect(componentDidMount, []);
  useEffect(handleTextChanges, [props.text]);
  useEffect(isInputtingEffect, [props.isInputting]);

  return (
    // TODO Eliminate range selection after double-clicking
    <TopDiv widthPx={textareaWidthPx} heightEm={textareaHeightEm}>
      {props.isInputting ? (
        <Textarea
          ref={textareaElement}
          readOnly={!props.isInputting}
          defaultValue={props.text}
          onChange={(e) => props.setText(e.target.value)}
          onFocus={handleFocus}
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

type TextDisplayProps = {
  widthPx: number;
  heightEm: number;
};

const TopDiv = styled.div<TextDisplayProps>`
  min-width: ${minWidthPx}px;
  width: ${(props) => props.widthPx}px;
  height: ${(props) => props.heightEm}em;
  font: ${font};
  line-height: ${lineHeightEm}em;
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
