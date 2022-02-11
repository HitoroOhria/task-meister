import React, { VFC } from "react";
import Children from "~/domain/model/Children";
import Node from "~/components/organisms/Node";
import * as NodeObj from "~/domain/model/Node";

type NodesProps = {
  nodes: Children;
  selectedNodeId: string;
  setIsInputting: (isInputting: boolean) => void;
  setSelectedNodeId: (id: string) => void;
  setNodeDataText: (id: string, text: string) => void;
  handleNodeTextChanges: (id: string, width: number, height: number) => void;
};

const Nodes: VFC<NodesProps> = (props) => {
  // TODO Move to Render object?
  const renderNode = (node: NodeObj.default): JSX.Element => {
    return (
      <Node
        key={node.id}
        nodeData={node}
        selectedNodeId={props.selectedNodeId}
        setIsInputting={props.setIsInputting}
        setSelectedNodeId={props.setSelectedNodeId}
        setNodeDataText={props.setNodeDataText}
        handleNodeTextChanges={props.handleNodeTextChanges}
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
