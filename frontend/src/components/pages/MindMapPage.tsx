import React, { VFC } from 'react'

import MindMapProvider from '~/store/provider/MindMapProvider'

import '~/components/pages/MindMapPage.css'
import MindMap from '~/components/pages/MindMap'

const MindMapPage: VFC = () => {
  return (
    <MindMapProvider>
      <MindMap />
    </MindMapProvider>
  )
}

export default MindMapPage
