import React, { VFC } from 'react'

import Path from '~/components/atoms/Path'

import MRootNode from '~/domain/model/MRootNode'
import MNode from '~/domain/model/MNode'
import Children from '~/domain/model/Children'

export const svgAreaWidth = 100 ** 3
export const svgAreaHeight = 100 ** 3

type Props = {
  rootNode: MRootNode
  children: Children
}

const SVGArea: VFC<Props> = (props) => {
  const renderBezierCurves = (children: Children): JSX.Element[] => {
    const childrenCurves = children.nodes.map((child) => renderBezierCurve(child))
    const grandChildrenCurves = children
      .filterHasChild()
      .flatMap((child) => (child.group.isHidden ? [] : renderBezierCurves(child.children)))

    return childrenCurves.concat(grandChildrenCurves)
  }

  const renderBezierCurve = (node: MNode): JSX.Element => {
    return <Path key={node.id} pathCommand={node.accessory.bezierCurve.pathCommand()} />
  }

  const renderLines = (children: Children): JSX.Element[] => {
    const nodesHasChild = children.filterHasChild()
    const childrenLines = nodesHasChild.map((child) => renderLine(child))
    const grandChildrenLines = nodesHasChild.flatMap((child) =>
      child.group.isHidden ? [] : renderLines(child.children)
    )

    return childrenLines.concat(grandChildrenLines)
  }

  const renderLine = (node: MNode): JSX.Element => {
    return <Path key={node.id} pathCommand={node.accessory.pathLine.pathCommand()} />
  }

  const renderRootNodeLine = (rootNode: MRootNode): JSX.Element => {
    return <Path pathCommand={rootNode.pathLine.pathCommand()} />
  }

  return (
    <svg width={svgAreaWidth} height={svgAreaHeight}>
      <g>{renderBezierCurves(props.children)}</g>
      <g>
        {props.children.nodes.length !== 0 && renderRootNodeLine(props.rootNode)}
        {renderLines(props.children)}
      </g>
    </svg>
  )
}

export default SVGArea
