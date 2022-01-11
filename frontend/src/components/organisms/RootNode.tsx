import React, { FC, useEffect, useRef, useState } from "react";
import { styled } from "@linaria/react";
import CanvasOperator from "../../domain/model/canvas_operator";

type RootNodeProps = {};

const minWidthPx = 50;
const lineHeightEm = 1;
const font = "13px monospace";
// For measure text width
const canvasOperator = new CanvasOperator(font);

const TextInputer = styled.textarea`
  min-width: ${minWidthPx}px;
  font: ${font};
  line-height: ${lineHeightEm}em
  border: solid blue;
  border-radius: 10px;
  background-color: gray;
  padding: 20px;
  resize: none;
`;

const RootNode: FC<RootNodeProps> = () => {
  const textInputerElement = useRef<HTMLTextAreaElement>(null);
  const [isInputting, setIsInputting] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const changeTextInputerHeight = () => {
    const numberOfLines = text.split("\n").length;
    const heightEm = numberOfLines * lineHeightEm;

    textInputerElement.current!.style.height = heightEm + "em";
  };

  const changeTextInputerWidth = () => {
    const longestLine = canvasOperator.findLongestLine(text);
    const textWidth = Math.ceil(canvasOperator.measureWidth(longestLine));
    const textareaWidth = textWidth > minWidthPx ? textWidth : minWidthPx;

    textInputerElement.current!.style.width = textareaWidth + "px";
  };

  useEffect(changeTextInputerHeight, [text]);
  useEffect(changeTextInputerWidth, [text]);

  return (
    // TODO Eliminate range selection after double-clicking
    <TextInputer
      ref={textInputerElement}
      readOnly={!isInputting}
      defaultValue={text}
      onChange={(e) => setText(e.target.value)}
      onDoubleClick={() => setIsInputting(true)}
      onBlur={() => setIsInputting(false)}
    />
  );
};

export default RootNode;
