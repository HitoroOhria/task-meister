import React, { useContext, useRef, VFC } from 'react'
import { styled } from '@linaria/react'

import { mindMapDataActionType as actionType } from '~/store/reducer/MindMapDataReducer'
import { MindMapDispatchCtx } from '~/store/context/MindMapDataCtx'

import PositionAdjuster from '~/components/atoms/PositionAdjuster'
import DraggableElement from '~/components/organisms/DraggableElement'
import TextInputer from '~/components/atoms/TextInputer'

import NodeData from '~/domain/model/NodeData'

// width of textarea from border to text
// values of below is average of measured values
export const borderWidth = 5
// one of vertical margin. unit is px.
export const verticalMargin = 15
// one of horizontal margin. unit is px.
export const horizontalMargin = 30
// padding of css. unit is px.
export const padding = 20

type Props = {
  node: NodeData
  isShiftEnter: boolean
}

const Node: VFC<Props> = (props) => {
  const nodeDivElement = useRef<HTMLDivElement>(null)
  const dispatchMindMapData = useContext(MindMapDispatchCtx)

  const handleNodeTextChanges = (text: string) => {
    if (text.slice(-1) === '\n' && !props.isShiftEnter) {
      outInputting()
      return
    }

    processNodeTextChanges(text)
  }

  // Do not use value of element to width and height. (ex. innerHeight, offsetHeight)
  // Because getting process ends before dom rendered. and the value of the previous text is acquired.
  // So, get previous value
  const processNodeTextChanges = (text: string) => {
    dispatchMindMapData({
      type: actionType.processNodeTextChanges,
      payload: { id: props.node.id, text },
    })
  }

  const outInputting = () => {
    // When added Node by Enter.
    if (!props.node.isSelected) return

    dispatchMindMapData({
      type: actionType.setNodeIsInputting,
      payload: { id: props.node.id, isInputting: false },
    })
  }

  const handleClick = () => {
    if (props.node.isSelected) return

    dispatchMindMapData({
      type: actionType.selectNode,
      payload: { id: props.node.id },
    })
  }

  const handleDoubleClick = () => {
    dispatchMindMapData({
      type: actionType.setNodeIsInputting,
      payload: { id: props.node.id, isInputting: true },
    })
  }

  return (
    <PositionAdjuster top={props.node.top} left={props.node.left}>
      <DraggableElement textData={props.node.id}>
        <NodeDiv
          ref={nodeDivElement}
          hidden={props.node.isHidden}
          borderColor={props.node.isSelected ? 'yellow' : 'blue'}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <TextInputer
            text={props.node.text}
            setText={(text) => handleNodeTextChanges(text)}
            isInputting={props.node.isInputting}
            handleBlur={outInputting}
          />
        </NodeDiv>
      </DraggableElement>
    </PositionAdjuster>
  )
}

export default Node

type NodeDivProps = {
  hidden: boolean
  borderColor: string
}

const NodeDiv = styled.div<NodeDivProps>`
  display: ${(props) => (props.hidden ? 'none' : 'block')};
  margin: ${verticalMargin}px ${horizontalMargin}px;
  padding: ${padding}px;
  border: thick solid ${(props) => props.borderColor};
  border-radius: 10px;
  background-color: gray;
`
