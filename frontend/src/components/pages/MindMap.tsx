import React, { useContext, useEffect, useState, VFC } from 'react'

import { mindMapDataActionType as actionType } from '~/store/reducer/MindMapDataReducer'
import { MindMapDispatchCtx, MindMapStateCtx } from '~/store/context/MindMapDataCtx'

import KeyInputManager from '~/components/organisms/KeyInputManager'
import SVGArea from '~/components/organisms/SVGArea'
import DrawingArea from '~/components/organisms/DrawingArea'
import DroppableArea from '~/components/organisms/DroppableArea'
import Origin from '~/components/organisms/Origin'
import Nodes from '~/components/organisms/Nodes'
import RootNode from '~/components/organisms/RootNode'

const MindMap: VFC = () => {
  const mindMapData = useContext(MindMapStateCtx)
  const dispatchMindMapData = useContext(MindMapDispatchCtx)
  const [isShiftEnter, setIsShiftEnter] = useState<boolean>(false)

  useEffect(() => dispatchMindMapData({ type: actionType.init, payload: {} }), [])

  return (
    <>
      <KeyInputManager setIsShitEnter={setIsShiftEnter} />
      <SVGArea rootNode={mindMapData.rootNode} children={mindMapData.rightMap.children} />
      <DrawingArea children={mindMapData.rightMap.children} />
      <DroppableArea>
        <Origin>
          <span style={{ position: 'absolute', top: -200 }}>A B C</span>
          <RootNode rootNode={mindMapData.rootNode} isShiftEnter={isShiftEnter} />
          <Nodes nodes={mindMapData.rightMap.children} isShiftEnter={isShiftEnter} />
        </Origin>
      </DroppableArea>
    </>
  )
}

export default MindMap
