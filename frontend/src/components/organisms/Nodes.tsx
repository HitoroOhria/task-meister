import React, { VFC } from 'react'
import Node from '~/components/organisms/Node'
import MNode from '~/domain/model/MNode'
import Children from '~/domain/model/Children'

type NodesProps = {
  nodes: Children
  isShiftEnter: boolean
}

const Nodes: VFC<NodesProps> = (props) => {
  const renderNodes = (children: Children): JSX.Element[] => {
    const nodes = children.nodes.map((child) => renderNode(child))
    const grandChildrenNodes = children.nodes.flatMap((child) =>
      child.collapsed ? [] : renderNodes(child.children)
    )

    return nodes.concat(grandChildrenNodes)
  }

  const renderNode = (node: MNode): JSX.Element => {
    return <Node key={node.id} node={node} isShiftEnter={props.isShiftEnter} />
  }

  return <>{renderNodes(props.nodes)}</>
}

export default Nodes
