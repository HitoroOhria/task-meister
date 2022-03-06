import React, { useContext, VFC } from 'react'

import CollapseButton from '~/components/atoms/CollapseButton'

import MNode from '~/domain/model/MNode'
import Children from '~/domain/model/Children'
import { MindMapDispatchCtx } from '~/store/context/MindMapCtx'
import { mindMapActionType } from '~/store/reducer/MindMapReducer'

type Props = {
  children: Children
}

const DrawingArea: VFC<Props> = (props) => {
  const dispatchMindMap = useContext(MindMapDispatchCtx)

  const dispatchToggleCollapse = (nodeId: string) => {
    dispatchMindMap({ type: mindMapActionType.toggleCollapse, payload: { id: nodeId } })
  }

  const renderCollapseButton = (node: MNode): JSX.Element => {
    return (
      <CollapseButton
        key={node.id}
        collapseButton={node.accessory.collapseButton}
        onClick={() => dispatchToggleCollapse(node.id)}
      />
    )
  }

  const renderCollapseButtons = (children: Children): JSX.Element[] => {
    const nodesHasChild = children.filterHasChild()
    const collapseButtons = nodesHasChild.map((child) => renderCollapseButton(child))
    const grandChildrenCollapseButtons = nodesHasChild.flatMap((child) =>
      child.collapsed ? [] : renderCollapseButtons(child.children)
    )

    return collapseButtons.concat(grandChildrenCollapseButtons)
  }

  // Enclose in div to make dom tree easier to see
  return <div>{renderCollapseButtons(props.children)}</div>
}

export default DrawingArea
