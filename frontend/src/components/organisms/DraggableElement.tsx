import React, { FC, ReactNode, useEffect, useRef } from 'react'

type Props = {
  textData: string
  preventDefault?: boolean
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
    props.preventDefault || addDragEventListener()
  }

  useEffect(componentDidMount, [])

  return (
    <div id="draggable-element" ref={draggableDivElement} draggable={!props.preventDefault}>
      {props.children}
    </div>
  )
}

export default DraggableElement
