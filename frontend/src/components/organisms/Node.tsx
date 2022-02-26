import React, { VFC } from 'react'

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
  return (
    <BaseNode node={props.node} isShiftEnter={props.isShiftEnter}>
      <Checkbox checkbox={props.node.checkbox} onClick={() => console.log('clicked!!')} />
      <Spacer width={spacerWidth} hidden={props.node.checkbox.hidden} />
    </BaseNode>
  )
}

export default Node
