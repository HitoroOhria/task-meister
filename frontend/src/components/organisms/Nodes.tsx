import React, { VFC } from "react";
import Node from "~/components/organisms/Node";
import * as NodeModel from "~/domain/model/Node";
import Children from "~/domain/model/Children";

type NodesProps = {
  nodes: Children;
  isShiftEnter: boolean;
};

const Nodes: VFC<NodesProps> = (props) => {
  const renderNode = (node: NodeModel.default): JSX.Element => {
    return <Node key={node.id} node={node} isShiftEnter={props.isShiftEnter} />;
  };

  const renderNodeAndChildren = (node: NodeModel.default): JSX.Element[] => {
    const selfNode = renderNode(node);
    const childrenNodes = node.group.isHidden ? [] : renderNodes(node.children);

    return [selfNode, ...childrenNodes];
  };

  const renderNodes = (children: Children): JSX.Element[] =>
    children.nodes.flatMap((child) => renderNodeAndChildren(child));

  return <>{renderNodes(props.nodes)}</>;
};

export default Nodes;
