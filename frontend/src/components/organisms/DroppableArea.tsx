import React, { DragEvent, FC, ReactNode, useContext } from 'react'
import { mindMapActionType as actionType } from '~/store/reducer/MindMapReducer'
import { MindMapDispatchCtx } from '~/store/context/MindMapCtx'
import { newDropPosition } from '~/domain/model/DropPosition'

type Props = {
  children?: ReactNode
}

const DroppableArea: FC<Props> = (props) => {
  const dispatchMindMap = useContext(MindMapDispatchCtx)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer!.dropEffect = 'move'
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const nodeId = e.dataTransfer!.getData('text/plain')
    const dropPosition = newDropPosition(e)

    dispatchMindMap({
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
