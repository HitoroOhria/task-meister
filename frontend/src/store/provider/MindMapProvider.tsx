import React, { FC, ReactNode, useReducer } from 'react'

import { mindMapReducer } from '~/store/reducer/MindMapReducer'
import { MindMapDispatchCtx, MindMapStateCtx } from '~/store/context/MindMapCtx'

import initMindMap from '~/util/testInitMindMap'

type Props = {
  children?: ReactNode
}

const MindMapProvider: FC<Props> = (props) => {
  const [mindMap, dispatchMindMap] = useReducer(mindMapReducer, initMindMap)

  return (
    <MindMapDispatchCtx.Provider value={dispatchMindMap}>
      <MindMapStateCtx.Provider value={mindMap}>{props.children}</MindMapStateCtx.Provider>
    </MindMapDispatchCtx.Provider>
  )
}

export default MindMapProvider
