import React, {useEffect, useRef, useState, VFC} from "react";
import {styled} from "@linaria/react";
import ElementSizeCalculator from "~/util/ElementSizeCalculator";
import {numberOfLines} from "~/util/StringUtil";

// CSS
export const minWidthPx = 50;
const lineHeightEm = 1;
const font = "13px monospace";

// const
// For measure text width
export const elementSizeCalculator = new ElementSizeCalculator(font);

type TextInputerProps = {
  text: string;
  setText: (text: string) => void;
  setGlobalIsInputting: (isInputting: boolean) => void;
};

type TextareaProps = {
  widthPx: number;
  heightEm: number;
};

const Textarea = styled.textarea<TextareaProps>`
  width: ${(props) => props.widthPx}px;
  min-width: ${minWidthPx}px;
  height: ${(props) => props.heightEm}em;
  font: ${font};
  line-height: ${lineHeightEm}em;
  border-color: gray;
  border-radius: 10px;
  background-color: gray;
  outline: none;
  padding: 20px;
  resize: none;
`;

const TextInputer: VFC<TextInputerProps> = (props) => {
  const textareaElement = useRef<HTMLTextAreaElement>(null);
  const [isInputting, setIsInputting] = useState<boolean>(false);
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

  const componentDidMount = () => {
    updateTextareaWidth();
    updateTextareaHeight();
  };

  useEffect(componentDidMount, []);
  useEffect(handleTextChanges, [props.text]);

  const handleDoubleClick = () => {
    setIsInputting(true);
    props.setGlobalIsInputting(true);
  };

  const handleBlur = () => {
    setIsInputting(false);
    props.setGlobalIsInputting(false);
  };

  return (
    // TODO Eliminate range selection after double-clicking
    <Textarea
      ref={textareaElement}
      readOnly={!isInputting}
      defaultValue={props.text}
      heightEm={textareaHeightEm}
      widthPx={textareaWidthPx}
      onChange={(e) => props.setText(e.target.value)}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
    />
  );
};

export default TextInputer;
