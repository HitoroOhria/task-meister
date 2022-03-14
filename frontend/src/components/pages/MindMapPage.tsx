import React, { useEffect, VFC } from 'react'

import MindMapProvider from '~/store/provider/MindMapProvider'

import '~/components/pages/MindMapPage.css'
import MindMap from '~/components/pages/MindMap'

export const fontFamily = 'monospace'

const MindMapPage: VFC = () => {
  const setFontFamily = () => {
    document.getElementsByTagName('body')[0].style.fontFamily = fontFamily
  }

  useEffect(setFontFamily, [])

  return (
    <MindMapProvider>
      <MindMap />
    </MindMapProvider>
  )
}

export default MindMapPage
