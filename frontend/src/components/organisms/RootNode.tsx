import React, { VFC } from 'react'

import BaseNode from '~/components/organisms/BaseNode'

import MRootNode from '~/domain/model/MRootNode'

type Props = {
  rootNode: MRootNode
  isShiftEnter: boolean
}

const RootNode: VFC<Props> = (props) => {
  return <BaseNode node={props.rootNode} isShiftEnter={props.isShiftEnter} isRootNode />
}

export default RootNode
