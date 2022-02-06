import React, { VFC } from "react";
import PositionAdjuster from "~/components/atoms/PositionAdjuster";
import Children from "~/domain/model/Children";
import Node from "~/components/organisms/Node";
import NodeData from "~/domain/model/NodeData";

type NodesProps = {
  nodes: Children;
  setNodeDataText: (id: string, text: string) => void;
  handleNodeTextChanges: (id: string, width: number, height: number) => void;
};

const Nodes: VFC<NodesProps> = (props) => {
  const renderNode = (nodeData: NodeData): JSX.Element => {
    return (
      <Node
        nodeData={nodeData}
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

    console.log(nodes.concat(childNodes));
    return nodes.concat(childNodes);
  };

  return (
    <PositionAdjuster top={0} left={0}>
      {renderNodes(props.nodes)}
    </PositionAdjuster>
  );
};

export default Nodes;
