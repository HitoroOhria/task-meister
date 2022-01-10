import React, { FC, useEffect, useRef, useState } from "react";
import { styled } from "@linaria/react";

type RootNodeProps = {};

const lineHeightEm = 1;

const TextInputer = styled.textarea`
  border: solid blue;
  border-radius: 10px;
  background-color: gray;
  line-height: ${lineHeightEm}em
  padding: 20px;
  resize: none;
`;

const RootNode: FC<RootNodeProps> = () => {
  const textInputerElement = useRef<HTMLTextAreaElement>(null);
  const [isInputting, setIsInputting] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const changeTextInputerHeight = () => {
    const numberOfLines = text.split("\n").length;
    const height = numberOfLines * lineHeightEm + "em";

    textInputerElement.current!.style.height = height;
  };

  useEffect(changeTextInputerHeight, [text]);

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
