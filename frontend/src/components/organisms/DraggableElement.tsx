import React, { FC, ReactNode, useEffect, useRef } from 'react'

type Props = {
  textData: string
  children?: ReactNode
}

const DraggableElement: FC<Props> = (props) => {
  const draggableDivElement = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer!.setData('text/plain', props.textData)
  }

  const addDragEventListener = () => {
    draggableDivElement.current!.addEventListener('dragstart', handleDragStart)
  }

  const componentDidMount = () => {
    addDragEventListener()
  }

  useEffect(componentDidMount, [])

  return (
    <div ref={draggableDivElement} draggable="true">
      {props.children}
    </div>
  )
}

export default DraggableElement
