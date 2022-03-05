import React, { useContext, VFC } from 'react'

import { mindMapDataActionType as actionType } from '~/store/reducer/MindMapDataReducer'
import { MindMapDispatchCtx } from '~/store/context/MindMapDataCtx'

import BaseNode from '~/components/organisms/BaseNode'
import Checkbox from '~/components/atoms/Checkbox'

import Spacer from '~/components/atoms/Spacer'
import MNode from '~/domain/model/MNode'
import EstimateTime from '~/components/atoms/EstimateTime'

// unit is px.
export const checkboxSpacerWidth = 12
// unit is px.
export const estimateTimeSpacerWidth = 12

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
      {{
        head: (
          <>
            <Checkbox checkbox={props.node.checkbox} onClick={toggleCheckbox} />
            <Spacer width={checkboxSpacerWidth} hidden={props.node.checkbox.hidden} />
          </>
        ),
        tail: props.node.checkbox.hidden || (
          <>
            <Spacer width={estimateTimeSpacerWidth} />
            <EstimateTime
              nodeId={props.node.id}
              estimateTime={props.node.estimateTime}
              disabled={props.node.checkbox.hidden}
              readOnly={props.node.checkbox.checked}
            />
          </>
        ),
      }}
    </BaseNode>
  )
}

export default Node
