import React, { VFC } from 'react'

import { styled } from '@linaria/react'
import { Card, Text } from '@nextui-org/react'
import { MdKeyboardTab } from 'react-icons/md'

// Margin from window. Unit is px.
const margin = 20

// Width of Card. Unit is px.
const cardWidth = 300
// Width of shortcut sign. Unit is px.
const shortcutWidth = 100
// Width of explain text. Unit is px.
const explainWidth = 100

type Props = {}

const ShortcutExplanationCard: VFC<Props> = (props) => {
  return (
    <PositionFixed>
      <Card css={{ width: cardWidth }}>
        <ShortcutRow>
          <Card shadow={false} css={{ width: shortcutWidth, backgroundColor: '#E4E4E4' }}>
            <MdKeyboardTab />
          </Card>
          <Text css={{ width: explainWidth }}>要素を追加</Text>
        </ShortcutRow>
      </Card>
    </PositionFixed>
  )
}

export default ShortcutExplanationCard

const PositionFixed = styled.div`
  position: fixed
  top: ${margin}px
  right: ${margin}px
`

const ShortcutRow = styled.div`
  display: flex;
  justify-content: space-around
  align-items: center
`
