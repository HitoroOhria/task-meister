import React from "react";
import { styled } from "@linaria/react";

const Textarea = styled.textarea`
  border: none;
  border-radius: 10px;
  padding: 20px;
  background-color: yellow;
  resize: none;
`;

function RootNode() {
  return (
    <div>
      <Textarea cols={30} rows={2} />
    </div>
  );
}

export default RootNode;
