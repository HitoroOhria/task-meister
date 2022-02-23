import React, { useContext, VFC } from 'react'

import CollapseButton from '~/components/atoms/CollapseButton'

import Node from '~/domain/model/Node'
import Children from '~/domain/model/Children'
import { MindMapDispatchCtx } from '~/store/context/MindMapDataCtx'
import { mindMapDataActionType } from '~/store/reducer/MindMapDataReducer'

type Props = {
  children: Children
}

const DrawingArea: VFC<Props> = (props) => {
  const dispatchMindMapData = useContext(MindMapDispatchCtx)

  const dispatchToggleCollapse = (nodeId: string) => {
    dispatchMindMapData({ type: mindMapDataActionType.toggleCollapse, payload: { id: nodeId } })
  }

  const renderCollapseButton = (node: Node): JSX.Element => {
    return (
      <CollapseButton
        key={node.id}
        top={node.collapseButton.point.y}
        left={node.collapseButton.point.x}
        onClick={() => dispatchToggleCollapse(node.id)}
      />
    )
  }

  const renderCollapseButtons = (children: Children): JSX.Element[] => {
    const nodesHasChild = children.nodes.filter((child) => child.children.nodes.length !== 0)
    const collapseButtons = nodesHasChild.map((child) => renderCollapseButton(child))
    const grandChildrenCollapseButtons = nodesHasChild.flatMap((child) =>
      renderCollapseButtons(child.children)
    )

    return collapseButtons.concat(grandChildrenCollapseButtons)
  }

  return <div>{renderCollapseButtons(props.children)}</div>
}

export default DrawingArea
