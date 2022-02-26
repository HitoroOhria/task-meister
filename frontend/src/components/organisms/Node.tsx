import React, { useContext, VFC } from 'react'

import { mindMapDataActionType as actionType } from '~/store/reducer/MindMapDataReducer'
import { MindMapDispatchCtx } from '~/store/context/MindMapDataCtx'

import BaseNode from '~/components/organisms/BaseNode'
import Checkbox from '~/components/atoms/Checkbox'

import Spacer from '~/components/atoms/Spacer'
import MNode from '~/domain/model/MNode'

// unit is px.
export const spacerWidth = 12

type Props = {
  node: MNode
  isShiftEnter: boolean
}

const Node: VFC<Props> = (props) => {
  const dispatchMindMapData = useContext(MindMapDispatchCtx)

  const toggleCheckbox = () => {
    dispatchMindMapData({ type: actionType.toggleCheckbox, payload: { id: props.node.id } })
  }

  return (
    <BaseNode node={props.node} isShiftEnter={props.isShiftEnter}>
      <Checkbox checkbox={props.node.checkbox} onClick={toggleCheckbox} />
      <Spacer width={spacerWidth} hidden={props.node.checkbox.hidden} />
    </BaseNode>
  )
}

export default Node
