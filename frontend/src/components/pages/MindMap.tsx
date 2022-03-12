import React, { useContext, useEffect, useState, VFC } from 'react'

import { mindMapActionType as actionType } from '~/store/reducer/MindMapReducer'
import { MindMapDispatchCtx, MindMapStateCtx } from '~/store/context/MindMapCtx'

import KeyInputManager from '~/components/organisms/KeyInputManager'
import SVGArea from '~/components/organisms/SVGArea'
import DrawingArea from '~/components/organisms/DrawingArea'
import DroppableArea from '~/components/organisms/DroppableArea'
import Origin from '~/components/organisms/Origin'
import Nodes from '~/components/organisms/Nodes'
import RootNode from '~/components/organisms/RootNode'

const MindMap: VFC = () => {
  const mindMap = useContext(MindMapStateCtx)
  const dispatchMindMap = useContext(MindMapDispatchCtx)
  const [isShiftEnter, setIsShiftEnter] = useState<boolean>(false)

  useEffect(() => dispatchMindMap({ type: actionType.init, payload: {} }), [])

  return (
    <>
      <KeyInputManager setIsShitEnter={setIsShiftEnter} />
      <SVGArea rootNode={mindMap.rootNode} children={mindMap.rightMap.children} />
      <DrawingArea children={mindMap.rightMap.children} />
      <DroppableArea>
        <Origin>
          <RootNode rootNode={mindMap.rootNode} isShiftEnter={isShiftEnter} />
          <Nodes nodes={mindMap.rightMap.children} isShiftEnter={isShiftEnter} />
        </Origin>
      </DroppableArea>
    </>
  )
}

export default MindMap
