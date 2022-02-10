import React, { VFC } from "react";
import Children from "~/domain/model/Children";
import Node from "~/components/organisms/Node";
import NodeData from "~/domain/model/NodeData";

type NodesProps = {
  nodes: Children;
  setSelectedNodeId: (id: string) => void;
  setNodeDataText: (id: string, text: string) => void;
  handleNodeTextChanges: (id: string, width: number, height: number) => void;
};

const Nodes: VFC<NodesProps> = (props) => {
  const renderNode = (nodeData: NodeData): JSX.Element => {
    return (
      <Node
        key={nodeData.id}
        nodeData={nodeData}
        setSelectedNodeId={props.setSelectedNodeId}
        setNodeDataText={props.setNodeDataText}
        handleNodeTextChanges={props.handleNodeTextChanges}
      />
    );
  };

  const renderNodes = (children: Children): JSX.Element[] => {
    const nodes = children.list.map((child) => renderNode(child));
    const childNodes = children.list.flatMap((child) =>
      renderNodes(child.children)
    );

    return nodes.concat(childNodes);
  };

  return <div>{renderNodes(props.nodes)}</div>;
};

export default Nodes;
