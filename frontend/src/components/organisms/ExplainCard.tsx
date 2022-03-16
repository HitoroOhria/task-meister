import React, { VFC } from 'react'

import { styled } from '@linaria/react'
import { Card } from '@nextui-org/react'

// Margin from window. Unit is px.
const margin = 20

type Props = {}

const ExplanationCard: VFC<Props> = (props) => {
  return (
    <PositionFixed>
      <Card>Explain Card</Card>
    </PositionFixed>
  )
}

export default ExplanationCard

const PositionFixed = styled.div`
  position: fixed
  top: ${margin}px
  right: ${margin}px
`
