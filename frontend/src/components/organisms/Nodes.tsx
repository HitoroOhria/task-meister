import React, { VFC } from "react";
import Children from "~/domain/model/Children";
import Node from "~/components/organisms/Node";
import * as NodeObj from "~/domain/model/Node";

type NodesProps = {
  nodes: Children;
};

const Nodes: VFC<NodesProps> = (props) => {
  // TODO Move to Render object?
  const renderNode = (node: NodeObj.default): JSX.Element => {
    return (
      <Node
        key={node.id}
        nodeData={node}
      />
    );
  };

  const renderNodeAndChildren = (node: NodeObj.default): JSX.Element[] => {
    const selfNode = renderNode(node);
    const childrenNodes = node.group.isHidden ? [] : renderNodes(node.children);

    return [selfNode, ...childrenNodes];
  };

  const renderNodes = (children: Children): JSX.Element[] =>
    children.nodes.flatMap((child) => renderNodeAndChildren(child));

  return <>{renderNodes(props.nodes)}</>;
};

export default Nodes;
