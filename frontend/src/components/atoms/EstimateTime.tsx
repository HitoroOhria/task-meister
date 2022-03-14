import React, { useContext, useEffect, useRef, VFC } from 'react'

import { Input } from '@nextui-org/react'

import { MindMapDispatchCtx } from '~/store/context/MindMapCtx'
import { mindMapActionType as actionType } from '~/store/reducer/MindMapReducer'

import MEstimateTime from '~/domain/model/MEstimateTime'

// Unit is px.
export const width = 90
// Unit is px.
// Measured value.
export const height = 40

const color = '#C1C1C1'

type Props = {
  nodeId: string
  estimateTime: MEstimateTime
  disabled: boolean
}

const EstimateTime: VFC<Props> = (props) => {
  const dispatchMindMap = useContext(MindMapDispatchCtx)
  const inputElement = useRef<HTMLInputElement>(null)

  const handleChange = (text: string) => {
    const minute = text === '' ? 0 : parseInt(text)
    if (text.length >= 4 || !Number.isInteger(minute) || minute < 0) {
      return
    }

    dispatchMindMap({
      type: actionType.setEstimateTime,
      payload: { id: props.nodeId, estimateTime: minute },
    })
  }

  const enterEditMode = () => {
    dispatchMindMap({
      type: actionType.enterEstimateTimeEditMode,
      payload: { id: props.nodeId },
    })
  }

  const exitEditMode = () => {
    dispatchMindMap({
      type: actionType.exitEstimateTimeEditMode,
      payload: { id: props.nodeId },
    })
  }

  const handleFocusAndBlur = () => {
    if (!inputElement.current) {
      return
    }

    props.estimateTime.isEditing ? inputElement.current.focus() : inputElement.current.blur()
  }

  useEffect(handleFocusAndBlur, [props.estimateTime.isEditing])

  return (
    <Input
      ref={inputElement}
      aria-label="EstimateTime"
      width={`${width}px`}
      css={{
        // Change text color.
        '.nextui-c-jeuecp': { color: props.disabled ? color : 'black' },
        // Change padding of content and text.
        '.nextui-c-PJLV-dBGXHd-applyStyles-true': { padding: '0px 5px' },
        // Change cursor when disabled.
        '.nextui-c-eXOOPO-gvlAwB-disabled-true': { cursor: 'default' },
      }}
      value={props.estimateTime.toString()}
      disabled={props.disabled}
      underlined
      labelRight="Min"
      onClick={enterEditMode}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={exitEditMode}
    />
  )
}

export default EstimateTime
