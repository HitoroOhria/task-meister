import React, { FC, ReactNode } from 'react'

import { styled } from '@linaria/react'
import { Card, Text } from '@nextui-org/react'

// Width of shortcut sign. Unit is px.
const shortcutWidth = 100
// Width of explain text. Unit is px.
const explainWidth = 100

type Props = {
  text: string
  children: ReactNode
}

const ShortcutExplanationCardRow: FC<Props> = (props) => {
  return (
    <ShortcutRow>
      <Card shadow={false} css={{ width: shortcutWidth, backgroundColor: '#E4E4E4' }}>
        {props.children}
      </Card>
      <Text css={{ width: explainWidth }}>{props.text}</Text>
    </ShortcutRow>
  )
}

export default ShortcutExplanationCardRow

const ShortcutRow = styled.div`
  display: flex;
  justify-content: space-around
  align-items: center
`
