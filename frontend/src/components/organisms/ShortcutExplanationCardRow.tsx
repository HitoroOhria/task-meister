import React, { FC, ReactNode } from 'react'

import { styled } from '@linaria/react'
import { Card, Text } from '@nextui-org/react'

// Width of shortcut sign. Unit is px.
export const shortcutWidth = 100
// Width of explain text. Unit is px.
export const explainWidth = 150
// Space between Shortcuts and Explain. Unit is px.
export const space = 10

type Props = {
  text: string
  children: ReactNode
}

const ShortcutExplanationCardRow: FC<Props> = (props) => {
  return (
    <ShortcutRow>
      <Card shadow={false} css={{ width: shortcutWidth, backgroundColor: '#E4E4E4' }}>
        <Icons>{props.children}</Icons>
      </Card>
      <Text css={{ width: explainWidth }}>{props.text}</Text>
    </ShortcutRow>
  )
}

export default ShortcutExplanationCardRow

const ShortcutRow = styled.div`
  margin: 4px 0
  display: flex
  justify-content: center
  align-items: center
  gap: ${space}px
`

const Icons = styled.div`
  display: flex
  justify-content: center
  align-items: center
  gap: 3px
`
