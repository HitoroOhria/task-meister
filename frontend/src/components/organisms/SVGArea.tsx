import React, { useContext, useEffect, VFC } from "react";

import { MindMapDispatchCtx } from "~/store/context/MindMapDataCtx";
import { mindMapDataActionType as actionType } from "~/store/reducer/MindMapDataReducer";

import Node from "~/domain/model/Node";
import Children from "~/domain/model/Children";

export const svgAreaWidth = 100 ** 3;
export const svgAreaHeight = 100 ** 3;

// ratio of path to line end.
export const pathLineRatio = 0.2;
const pathColor = "blue";
const pathWidth = 3;

type Props = {
  children: Children;
};

const SVGArea: VFC<Props> = (props) => {
  const dispatchMindMapData = useContext(MindMapDispatchCtx);

  // TODO Cut out to RelationshipLine
  const renderPath = (node: Node): JSX.Element => {
    return (
      <path
        key={node.id}
        d={node.relationshipLine.getPathCommand()}
        stroke={pathColor}
        strokeWidth={pathWidth}
        fill="none"
      />
    );
  };

  const renderPaths = (children: Children): JSX.Element[] => {
    const childrenPaths = children.nodes.flatMap((child) => renderPath(child));
    const grandChildrenPaths = children.nodes.flatMap((child) =>
      child.group.isHidden ? [] : renderPaths(child.children)
    );

    return childrenPaths.concat(grandChildrenPaths);
  };

  const updateRelationshipLine = () => {
    dispatchMindMapData({
      type: actionType.updateAllRelationshipLine,
      payload: {},
    });
  };

  useEffect(updateRelationshipLine, []);

  return (
    <svg
      // TODO Control Scroll Area
      width={svgAreaWidth}
      height={svgAreaHeight}
    >
      {renderPaths(props.children)}
    </svg>
  );
};

export default SVGArea;
