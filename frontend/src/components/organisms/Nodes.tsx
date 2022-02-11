import React, { VFC } from "react";
import Children from "~/domain/model/Children";
import Node from "~/components/organisms/Node";
import NodeData from "~/domain/model/NodeData";

type NodesProps = {
  nodes: Children;
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  setNodeDataText: (id: string, text: string) => void;
  handleNodeTextChanges: (id: string, width: number, height: number) => void;
};

const Nodes: VFC<NodesProps> = (props) => {
  // TODO Move to Render object?
  const renderNode = (nodeData: NodeData): JSX.Element => {
    return (
      <Node
        key={nodeData.id}
        nodeData={nodeData}
        selectedNodeId={props.selectedNodeId}
        setSelectedNodeId={props.setSelectedNodeId}
        setNodeDataText={props.setNodeDataText}
        handleNodeTextChanges={props.handleNodeTextChanges}
      />
    );
  };

  const renderNodeAndChildren = (nodeData: NodeData): JSX.Element[] => {
    const node = renderNode(nodeData);
    const childrenNodes = nodeData.group.isHidden
      ? []
      : renderNodes(nodeData.children);

    return [node, ...childrenNodes];
  };

  const renderNodes = (children: Children): JSX.Element[] =>
    children.list.flatMap((child) => renderNodeAndChildren(child));

  return <>{renderNodes(props.nodes)}</>;
};

export default Nodes;
