import React, { VFC } from 'react'

import { styled } from '@linaria/react'
import { Card } from '@nextui-org/react'
import { MdKeyboardTab } from 'react-icons/md'

import ShortcutExplanationCardRow from '~/components/organisms/ShortcutExplanationCardRow'

// Margin from window. Unit is px.
const margin = 20

// Width of Card. Unit is px.
const cardWidth = 300

type Props = {}

const ShortcutExplanationCard: VFC<Props> = (props) => {
  return (
    <PositionFixed>
      <Card css={{ width: cardWidth }}>
        <ShortcutExplanationCardRow text={'要素を追加'}>
          <MdKeyboardTab />
        </ShortcutExplanationCardRow>
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
