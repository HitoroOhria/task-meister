import React, { VFC } from 'react'

import { styled } from '@linaria/react'
import { Card } from '@nextui-org/react'
import { MdKeyboardTab } from 'react-icons/md'

// Margin from window. Unit is px.
const margin = 20

type Props = {}

const ExplanationCard: VFC<Props> = (props) => {
  return (
    <PositionFixed>
      <Card>
        <Card shadow={false} css={{ backgroundColor: '#E4E4E4' }}>
          <MdKeyboardTab />
        </Card>
      </Card>
    </PositionFixed>
  )
}

export default ExplanationCard

const PositionFixed = styled.div`
  position: fixed
  top: ${margin}px
  right: ${margin}px
`
