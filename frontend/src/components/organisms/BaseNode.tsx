import React, { FC, ReactNode, useContext, useRef } from 'react'
import { MindMapDispatchCtx } from '~/store/context/MindMapDataCtx'
import { mindMapDataActionType as actionType } from '~/store/reducer/MindMapDataReducer'
import PositionAdjuster from '~/components/atoms/PositionAdjuster'
import DraggableElement from '~/components/organisms/DraggableElement'
import TextInputer from '~/components/atoms/TextInputer'
import { styled } from '@linaria/react'
import MBaseNode from '~/domain/model/MBaseNode'

// Ratio of width representing tail area of node.
export const tailAreaRatio = 0.2

// Width of textarea from border to text.
// Values of below is average of measured values.
export const borderWidth = 5
// One of vertical margin. unit is px.
export const verticalMargin = 15
// One of horizontal margin. unit is px.
export const horizontalMargin = 30
// Padding of css. unit is px.
export const padding = 20
export const backgroundColor = 'white'

type Props = {
  node: MBaseNode
  isShiftEnter: boolean
  // TODO This is not elegant
  //   - adding type to MBaseNode is failed.
  //     - Typescript completion does not work
  isRootNode?: boolean
  children?: ReactNode
}

const BaseNode: FC<Props> = (props) => {
  const nodeDivElement = useRef<HTMLDivElement>(null)
  const dispatchMindMapData = useContext(MindMapDispatchCtx)

  const handleNodeTextChanges = (text: string) => {
    if (text.slice(-1) === '\n' && !props.isShiftEnter) {
      exitEditMode()
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

  const exitEditMode = () => {
    // When added Node by Enter.
    if (!props.node.isSelected) return

    dispatchMindMapData({ type: actionType.exitNodeEditMode, payload: { id: props.node.id } })
  }

  const handleClick = () => {
    if (props.node.isSelected) return

    dispatchMindMapData({
      type: actionType.selectNode,
      payload: { id: props.node.id },
    })
  }

  const handleDoubleClick = () => {
    dispatchMindMapData({ type: actionType.enterNodeEditMode, payload: { id: props.node.id } })
  }

  return (
    <PositionAdjuster top={props.node.top} left={props.node.left}>
      <DraggableElement textData={props.node.id} preventDefault={props.isRootNode}>
        <NodeDiv
          ref={nodeDivElement}
          hidden={props.node.isHidden}
          selected={props.node.isSelected}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          {props.children}
          <TextInputer
            text={props.node.text}
            isInputting={props.node.isInputting}
            disable={props.node.disable()}
            onChange={(text) => handleNodeTextChanges(text)}
            onBlur={exitEditMode}
          />
        </NodeDiv>
      </DraggableElement>
    </PositionAdjuster>
  )
}

export default BaseNode

type NodeDivProps = {
  hidden: boolean
  selected: boolean
}

const NodeDiv = styled.div<NodeDivProps>`
  display: ${(props) => (props.hidden ? 'none' : 'block')};
  margin: ${verticalMargin}px ${horizontalMargin}px;
  padding: ${padding}px;
  border: thick solid ${(props) => (props.selected ? 'yellow' : 'blue')};
  border-radius: 10px
  background-color: ${backgroundColor}
  display: flex
  align-items: center
`
