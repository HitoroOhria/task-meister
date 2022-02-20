import React, { useContext, useEffect, VFC } from 'react'

import { MindMapDispatchCtx } from '~/store/context/MindMapDataCtx'
import { mindMapDataActionType as actionType } from '~/store/reducer/MindMapDataReducer'

import RelationshipPath from '~/components/atoms/RelationshipPath'

import Node from '~/domain/model/Node'
import Children from '~/domain/model/Children'

export const svgAreaWidth = 100 ** 3
export const svgAreaHeight = 100 ** 3

type Props = {
  children: Children
}

const SVGArea: VFC<Props> = (props) => {
  const dispatchMindMapData = useContext(MindMapDispatchCtx)

  const renderPath = (node: Node): JSX.Element => {
    return <RelationshipPath key={node.id} pathCommand={node.relationshipLine.getPathCommand()} />
  }

  const renderPaths = (children: Children): JSX.Element[] => {
    const childrenPaths = children.nodes.flatMap((child) => renderPath(child))
    const grandChildrenPaths = children.nodes.flatMap((child) =>
      child.group.isHidden ? [] : renderPaths(child.children)
    )

    return childrenPaths.concat(grandChildrenPaths)
  }

  const updateRelationshipLine = () => {
    dispatchMindMapData({
      type: actionType.updateAllRelationshipLine,
      payload: {},
    })
  }

  useEffect(updateRelationshipLine, [])

  return (
    <svg width={svgAreaWidth} height={svgAreaHeight}>
      {renderPaths(props.children)}
    </svg>
  )
}

export default SVGArea
