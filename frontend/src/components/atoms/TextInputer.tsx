import React, {useEffect, useRef, useState, VFC} from "react";
import {styled} from "@linaria/react";
import ElementSizeCalculator from "~/util/ElementSizeCalculator";
import {numberOfLines} from "~/util/StringUtil";

// CSS
export const minWidthPx = 50;
const lineHeightEm = 1;
const font = "15px monospace";

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
    if (textareaElement.current === null) return;

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
    <TopDiv>
      {props.isInputting ? (
        <Textarea
          ref={textareaElement}
          readOnly={!props.isInputting}
          defaultValue={props.text}
          widthPx={textareaWidthPx}
          heightEm={textareaHeightEm}
          onChange={(e) => props.setText(e.target.value)}
          onFocus={handleFocus}
          onBlur={props.handleBlur}
        />
      ) : (
        <SpanWrapper widthPx={textareaWidthPx} heightEm={textareaHeightEm}>
          <span>{props.text}</span>
        </SpanWrapper>
      )}
    </TopDiv>
  );
};

export default TextInputer;

type TextDisplayProps = {
  widthPx: number;
  heightEm: number;
};

const TopDiv = styled.div`
  font: ${font};
`;

// TODO Can refactor Textarea and SpanWrapper to using TopDix?
const Textarea = styled.textarea<TextDisplayProps>`
  width: ${(props) => props.widthPx}px;
  min-width: ${minWidthPx}px;
  height: ${(props) => props.heightEm}em;
  font: inherit;
  line-height: ${lineHeightEm}em;
  border-color: gray;
  background-color: gray;
  outline: none;
  resize: none;
  overflow: hidden;
`;

const SpanWrapper = styled.div<TextDisplayProps>`
  width: ${(props) => props.widthPx}px;
  min-width: ${minWidthPx}px;
  height: ${(props) => props.heightEm}em;
  font: inherit;
  display: flex;
  align-items: center;
`;
