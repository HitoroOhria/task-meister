import React, { FC } from "react";
import { styled } from "@linaria/react";

type RootNodeProps = {
  text: string;
};

const TextDisplayer = styled.span`
  border: solid blue;
  border-radius: 10px;
  padding: 20px;
  background-color: yellow;
`;

const RootNode: FC<RootNodeProps> = (props) => {
  return (
    <div>
      <TextDisplayer>{props.text}</TextDisplayer>
    </div>
  );
};

export default RootNode;
