import React, { useContext, VFC } from "react";
import { OriginPointStateCtx } from "~/store/context/OriginPointCtx";
import { horizontalMargin, verticalMargin } from "~/components/organisms/Node";
import NodeData from "~/domain/model/NodeData";
import Node from "~/domain/model/Node";
import Children from "~/domain/model/Children";

const straightLineRatio = 0.2;

type Props = {
  rootNode: NodeData;
  children: Children;
};

const SVG: VFC<Props> = (props) => {
  const originPoint = useContext(OriginPointStateCtx);

  const getPathCommand = (parentNode: NodeData, node: NodeData): string => {
    const nodeElementWidth = parentNode.width - horizontalMargin * 2;
    const startPointX =
      originPoint.clientX +
      parentNode.left +
      horizontalMargin +
      nodeElementWidth;
    const startPointY =
      originPoint.clientY + parentNode.top + parentNode.height / 2;

    const collapsePointX =
      startPointX + horizontalMargin * 2 * straightLineRatio;
    const collapsePointY = startPointY;

    const firstControlPointX =
      collapsePointX + (horizontalMargin * 2 * (1 - straightLineRatio)) / 2;
    const firstControlPointY = collapsePointY;

    const secondControlPointX = firstControlPointX;
    const nodeElementHeight = node.height - verticalMargin * 2;
    const secondControlPointY =
      originPoint.clientY + node.top + verticalMargin + nodeElementHeight / 2;

    const endPointX = startPointX + horizontalMargin * 2;
    const endPointY = secondControlPointY;

    const moveTo = `M ${startPointX} ${startPointY}`;
    const lineTo = `L ${collapsePointX} ${collapsePointY}`;
    const curveTo = `C ${firstControlPointX} ${firstControlPointY} ${secondControlPointX} ${secondControlPointY} ${endPointX} ${endPointY}`;

    return `${moveTo} ${lineTo} ${curveTo}`;
  };

  const renderPath = (parentNode: NodeData, node: NodeData): JSX.Element => {
    return (
      <path
        key={node.id}
        style={{ position: "absolute", top: 0, left: 0 }}
        d={getPathCommand(parentNode, node)}
        stroke="red"
        strokeWidth="3px"
        fill="none"
      />
    );
  };

  const renderSelfAndChildrenPath = (
    parentNode: NodeData,
    node: Node
  ): JSX.Element[] => {
    const path = renderPath(parentNode, node);
    const childrenPath = node.group.isHidden
      ? []
      : node.children.nodes.flatMap((childNode) =>
          renderSelfAndChildrenPath(node, childNode)
        );

    return childrenPath.concat(path);
  };

  const renderPaths = (
    rootNode: NodeData,
    children: Children
  ): JSX.Element[] => {
    return children.nodes.flatMap((node) =>
      renderSelfAndChildrenPath(rootNode, node)
    );
  };

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0 }}
      width={100 ** 3}
      height={100 ** 3}
    >
      {renderPaths(props.rootNode, props.children)}
    </svg>
  );
};

export default SVG;
