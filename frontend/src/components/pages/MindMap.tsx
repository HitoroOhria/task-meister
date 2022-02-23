import React, { useContext, useEffect, useState, VFC } from 'react'

import { mindMapDataActionType } from '~/store/reducer/MindMapDataReducer'
import { MindMapDispatchCtx, MindMapStateCtx } from '~/store/context/MindMapDataCtx'

import KeyInputManager from '~/components/organisms/KeyInputManager'
import SVGArea from '~/components/organisms/SVGArea'
import DrawingArea from '~/components/organisms/DrawingArea'
import DroppableArea from '~/components/organisms/DroppableArea'
import Origin from '~/components/organisms/Origin'
import Node from '~/components/organisms/Node'
import Nodes from '~/components/organisms/Nodes'

const MindMap: VFC = () => {
  const mindMapData = useContext(MindMapStateCtx)
  const dispatchMindMapData = useContext(MindMapDispatchCtx)
  const [isShiftEnter, setIsShiftEnter] = useState<boolean>(false)

  useEffect(() => dispatchMindMapData({ type: mindMapDataActionType.init, payload: {} }), [])

  return (
    <>
      <KeyInputManager setIsShitEnter={setIsShiftEnter} />
      <SVGArea rootNode={mindMapData.rootNode} children={mindMapData.rightMap.children} />
      <DrawingArea children={mindMapData.rightMap.children} />
      <DroppableArea>
        <Origin>
          <Node node={mindMapData.rootNode} isShiftEnter={isShiftEnter} />
          <Nodes nodes={mindMapData.rightMap.children} isShiftEnter={isShiftEnter} />
        </Origin>
      </DroppableArea>
    </>
  )
}

export default MindMap
