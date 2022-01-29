import React, {useEffect, useRef, useState, VFC} from "react";
import {styled} from "@linaria/react";
import ElementSizeCalculator from "~/domain/model/ElementSizeCalculator";
import {numberOfLines} from "~/util/StringUtil";

// CSS
const minWidthPx = 50;
const lineHeightEm = 1;
const font = "13px monospace";

// const
// For measure text width
export const elementSizeCalculator = new ElementSizeCalculator(font);

type TextInputerProps = {
  text: string;
  setText: (text: string) => void;
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
  line-height: ${lineHeightEm}em
  border: solid blue;
  border-radius: 10px;
  background-color: gray;
  padding: 20px;
  resize: none;
`;

const TextInputer: VFC<TextInputerProps> = (props) => {
  const textareaElement = useRef<HTMLTextAreaElement>(null);
  const [isInputting, setIsInputting] = useState<boolean>(false);
  const [textareaWidthPx, setTextareaWidthPx] = useState<number>(0);
  const [textareaHeightEm, setTextareaHeightEm] = useState<number>(0);

  const componentDidMount = () => {
    if (textareaElement.current == null) {
      return;
    }

    // useEffect の方で代用できるか？
    updateTextInputerWidth();
    updateTextInputerHeight();
  };

  const processChangingText = () => {
    updateTextInputerWidth();
    updateTextInputerHeight();
  };

  const updateTextInputerWidth = () => {
    if (textareaElement.current === null) {
      return;
    }

    const textWidth = Math.ceil(
      elementSizeCalculator.measureLongestLineWidth(props.text)
    );
    const textareaWidth = textWidth > minWidthPx ? textWidth : minWidthPx;

    setTextareaWidthPx(textareaWidth);
  };

  const updateTextInputerHeight = () => {
    if (textareaElement.current === null) {
      return;
    }

    const heightEm = numberOfLines(props.text) * lineHeightEm;
    setTextareaHeightEm(heightEm);
  };

  useEffect(componentDidMount, []);
  useEffect(processChangingText, [props.text]);

  return (
    // TODO Eliminate range selection after double-clicking
    <Textarea
      ref={textareaElement}
      readOnly={!isInputting}
      defaultValue={props.text}
      heightEm={textareaHeightEm}
      widthPx={textareaWidthPx}
      onChange={(e) => props.setText(e.target.value)}
      onDoubleClick={() => setIsInputting(true)}
      onBlur={() => setIsInputting(false)}
    />
  );
};

export default TextInputer;
