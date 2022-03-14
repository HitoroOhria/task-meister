import React, { useEffect, VFC } from 'react'

import MindMapProvider from '~/store/provider/MindMapProvider'

import '~/components/pages/MindMapPage.css'
import MindMap from '~/components/pages/MindMap'

import { baseFontFamily } from '~/const/fontConst'

const MindMapPage: VFC = () => {
  const setFontFamily = () => {
    document.getElementsByTagName('body')[0].style.fontFamily = baseFontFamily
  }

  useEffect(setFontFamily, [])

  return (
    <MindMapProvider>
      <MindMap />
    </MindMapProvider>
  )
}

export default MindMapPage
