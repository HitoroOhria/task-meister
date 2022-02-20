import React, { FC, ReactNode, useReducer } from 'react'
import { MindMapDispatchCtx, MindMapStateCtx } from '~/store/context/MindMapDataCtx'
import { mindMapDataReducer } from '~/store/reducer/MindMapDataReducer'
import initMindMapData from '~/util/testInitMindMapData'

type Props = {
  children?: ReactNode
}

const MindMapDataProvider: FC<Props> = (props) => {
  const [mindMapData, dispatchMindMapData] = useReducer(mindMapDataReducer, initMindMapData)

  return (
    <MindMapDispatchCtx.Provider value={dispatchMindMapData}>
      <MindMapStateCtx.Provider value={mindMapData}>{props.children}</MindMapStateCtx.Provider>
    </MindMapDispatchCtx.Provider>
  )
}

export default MindMapDataProvider
