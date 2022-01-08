import React, { FC } from "react";
import { styled } from "@linaria/react";

type RootNodeProps = {
  isInput: boolean;
  text: string;
  handleTextChange: (text: string) => void;
};

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

const RootNode: FC<RootNodeProps> = (props) => {
  return (
    <div>
      {props.isInput ? (
        <TextInputer onChange={(e) => props.handleTextChange(e.target.value)}>
          {props.text}
        </TextInputer>
      ) : (
        <TextDisplayer>{props.text}</TextDisplayer>
      )}
    </div>
  );
};

export default RootNode;
