import React, { DragEvent, FC, ReactNode, useContext } from 'react'
import { mindMapDataActionType as actionType } from '~/store/reducer/MindMapDataReducer'
import { MindMapDispatchCtx } from '~/store/context/MindMapDataCtx'
import { newDropPosition } from '~/domain/model/DropPosition'

type Props = {
  children?: ReactNode
}

const DroppableArea: FC<Props> = (props) => {
  const dispatchMindMapData = useContext(MindMapDispatchCtx)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer!.dropEffect = 'move'
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const nodeId = e.dataTransfer!.getData('text/plain')
    const dropPosition = newDropPosition(e)

    dispatchMindMapData({
      type: actionType.dragAndDropNode,
      payload: { id: nodeId, dropPosition },
    })
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ width: window.innerWidth, height: window.innerHeight }}
    >
      {props.children}
    </div>
  )
}

export default DroppableArea
