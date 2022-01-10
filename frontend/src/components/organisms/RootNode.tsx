import React, { FC, useState } from "react";
import { styled } from "@linaria/react";
import _ from "lodash";

type RootNodeProps = {};

const TextDisplayer = styled.span`
  border: solid blue;
  border-radius: 10px;
  background-color: yellow;
  display: block;
  padding: 20px;
`;

const TextInputer = styled.textarea`
  border: solid blue;
  border-radius: 10px;
  padding: 20px;
  background-color: gray;
  resize: none;
`;

const RootNode: FC<RootNodeProps> = () => {
  const [id] = useState<string>(_.uniqueId("TextDisplayer"));
  const [isInput, setIsInput] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const processInInputting = () => {
    setIsInput(true);
    document.addEventListener("click", inputtingClickListener);
  };

  const processOutInputting = () => {
    setIsInput(false);
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

  const handleDoubleClick = () => {
    processInInputting();
  };

  return (
    <TextDisplayer id={id} onDoubleClick={handleDoubleClick}>
      {isInput ? (
        <TextInputer
          defaultValue={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        text
      )}
    </TextDisplayer>
  );
};

export default RootNode;
