import React, { VFC } from "react";

export const pathLineRatio = 0.2;

const pathColor = "blue";
const pathWidth = 3;

type Props = {
  pathCommand: string;
};

const RelationshipPath: VFC<Props> = (props) => {
  return (
    <path
      d={props.pathCommand}
      stroke={pathColor}
      strokeWidth={pathWidth}
      fill="none"
    />
  );
};

export default RelationshipPath; // ratio of path to line end.
