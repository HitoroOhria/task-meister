import React, {useContext, VFC} from 'react'

import {mindMapActionType as actionType} from '~/store/reducer/MindMapReducer'
import {MindMapDispatchCtx} from '~/store/context/MindMapCtx'

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
  const dispatchMindMap = useContext(MindMapDispatchCtx)

  const toggleCheckbox = () => {
    dispatchMindMap({ type: actionType.toggleCheckbox, payload: { id: props.node.id } })
  }

  return (
    <BaseNode node={props.node} isShiftEnter={props.isShiftEnter}>
      {{
        head: (
          <>
            {/*TODO Control hidden on this place.*/}
            <Checkbox checkbox={props.node.content.checkbox} onClick={toggleCheckbox} />
            <Spacer width={checkboxSpacerWidth} hidden={props.node.content.checkbox.hidden} />
          </>
        ),
        tail: props.node.showEstimateTime() && (
          <>
            <Spacer width={estimateTimeSpacerWidth} />
            <EstimateTime
              nodeId={props.node.id}
              estimateTime={props.node.content.estimateTime}
              // When one or more children elements is checked or this node is checked.
              disabled={props.node.content.checkbox.hidden || props.node.content.checkbox.checked}
            />
          </>
        ),
      }}
    </BaseNode>
  )
}

export default Node
