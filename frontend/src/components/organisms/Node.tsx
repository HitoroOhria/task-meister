import React, { FC, useEffect, useRef, useState } from "react";
import { styled } from "@linaria/react";
import ElementSizeCalculator from "../../domain/model/element_size_calculator";

type NodeProps = {};

const minWidthPx = 50;
const lineHeightEm = 1;
const font = "13px monospace";
// For measure text width
const elementSizeCalculator = new ElementSizeCalculator(font);

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

const Node: FC<NodeProps> = () => {
  const textInputerElement = useRef<HTMLTextAreaElement>(null);
  const [isInputting, setIsInputting] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const changeTextInputerHeight = () => {
    const numberOfLines = text.split("\n").length;
    const heightEm = numberOfLines * lineHeightEm;

    textInputerElement.current!.style.height = heightEm + "em";
  };

  const changeTextInputerWidth = () => {
    const longestLine = elementSizeCalculator.findLongestLine(text);
    const textWidth = Math.ceil(elementSizeCalculator.measureWidth(longestLine));
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

export default Node;
