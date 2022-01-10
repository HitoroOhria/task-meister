import React, { FC, useEffect, useRef, useState } from "react";
import { styled } from "@linaria/react";
import _ from "lodash";

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
  const [id] = useState<string>(_.uniqueId("TextDisplayer"));
  const [isInputting, setIsInputting] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const changeTextareaHeight = () => {
    const numberOfLines = text.split("\n").length;
    const height = numberOfLines * lineHeightEm + "em";

    textInputerElement.current!.style.height = height;
  };

  useEffect(changeTextareaHeight, [text]);

  const processInInputting = () => {
    setIsInputting(true);
    document.addEventListener("click", inputtingClickListener);
  };

  const processOutInputting = () => {
    setIsInputting(false);
    document.removeEventListener("click", inputtingClickListener);
  };

  const inputtingClickListener = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!isInRootNodeArea(target)) {
      processOutInputting();
    }
  };

  const isInRootNodeArea = (target: HTMLElement): boolean => {
    return !!target.closest<HTMLElementTagNameMap["textarea"]>("#" + id);
  };

  const handleOnChange = (text: string) => {
    setText(text);
    changeTextareaHeight();
  };

  const handleDoubleClick = () => {
    processInInputting();
  };

  return (
    <TextInputer
      id={id}
      ref={textInputerElement}
      readOnly={!isInputting}
      defaultValue={text}
      onChange={(e) => handleOnChange(e.target.value)}
      onDoubleClick={handleDoubleClick}
    />
  );
};

export default RootNode;
