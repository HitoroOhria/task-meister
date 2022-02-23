import React, { useContext, useState, VFC } from 'react'

import { MindMapStateCtx } from '~/store/context/MindMapDataCtx'

import KeyInputManager from '~/components/organisms/KeyInputManager'
import SVGArea from '~/components/organisms/SVGArea'
import DroppableArea from '~/components/organisms/DroppableArea'
import Origin from '~/components/organisms/Origin'
import Node from '~/components/organisms/Node'
import Nodes from '~/components/organisms/Nodes'
import DrawingArea from '~/components/organisms/DrawingArea'

const MindMap: VFC = () => {
  const mindMapData = useContext(MindMapStateCtx)
  const [isShiftEnter, setIsShiftEnter] = useState<boolean>(false)

  // TODO Why is display smaller on monitor?
  return (
    <>
      <KeyInputManager setIsShitEnter={setIsShiftEnter} />
      <SVGArea children={mindMapData.rightMap.children} />
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
