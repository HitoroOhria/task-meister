import React, { FC, ReactNode, useContext, useRef } from 'react'
import { MindMapDispatchCtx } from '~/store/context/MindMapCtx'
import { mindMapActionType as actionType } from '~/store/reducer/MindMapReducer'
import PositionAdjuster from '~/components/atoms/PositionAdjuster'
import DraggableElement from '~/components/organisms/DraggableElement'
import NodeText from '~/components/atoms/NodeText'
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
  children?: {
    head: ReactNode
    tail: ReactNode
  }
}

const BaseNode: FC<Props> = (props) => {
  const nodeDivElement = useRef<HTMLDivElement>(null)
  const dispatchMindMap = useContext(MindMapDispatchCtx)

  const handleNodeTextChanges = (text: string) => {
    if (text.slice(-1) === '\n' && !props.isShiftEnter) {
      exitEditMode()
      return
    }

    setNodeText(text)
  }

  // Do not use value of element to width and height. (ex. innerHeight, offsetHeight)
  // Because getting process ends before dom rendered. and the value of the previous text is acquired.
  // So, get previous value.
  const setNodeText = (text: string) => {
    dispatchMindMap({
      type: actionType.setNodeText,
      payload: { id: props.node.id, text },
    })
  }

  const exitEditMode = () => {
    // When added Node by Enter.
    if (!props.node.isSelected) return

    dispatchMindMap({ type: actionType.exitNodeEditMode, payload: { id: props.node.id } })
  }

  const handleClick = () => {
    if (props.node.isSelected) return

    dispatchMindMap({
      type: actionType.selectNode,
      payload: { id: props.node.id },
    })
  }

  const handleNodeTextClick = () => {
    dispatchMindMap({ type: actionType.enterNodeEditMode, payload: { id: props.node.id } })
  }

  return (
    <PositionAdjuster position={'absolute'} top={props.node.top} left={props.node.left}>
      <DraggableElement textData={props.node.id} preventDefault={props.isRootNode}>
        <NodeDiv
          ref={nodeDivElement}
          width={props.node.getElementWidth()}
          height={props.node.getElementHeight()}
          hidden={props.node.isHidden}
          selected={props.node.isSelected}
          onClick={handleClick}
        >
          {props.children?.head}
          <NodeText
            text={props.node.text}
            isInputting={props.node.isInputting}
            disable={props.node.disable()}
            onClick={handleNodeTextClick}
            onChange={(text) => handleNodeTextChanges(text)}
            onBlur={exitEditMode}
          />
          {props.children?.tail}
        </NodeDiv>
      </DraggableElement>
    </PositionAdjuster>
  )
}

export default BaseNode

type NodeDivProps = {
  width: number
  height: number
  hidden: boolean
  selected: boolean
}

const NodeDiv = styled.div<NodeDivProps>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  display: ${(props) => (props.hidden ? 'none' : 'block')};
  margin: ${verticalMargin}px ${horizontalMargin}px;
  padding: ${padding}px;
  border: thick solid ${(props) => (props.selected ? 'greenyellow' : 'blue')};
  border-radius: 10px
  background-color: ${backgroundColor}
  display: flex
  align-items: center
`
