import React, { VFC } from 'react'

import { styled } from '@linaria/react'

import PositionAdjuster from '~/components/atoms/PositionAdjuster'
import MCollapseButton from '~/domain/model/MCollapseButton'

// unit is px.
export const diameter = 18
const color = 'blue'

type Props = {
  collapseButton: MCollapseButton
  onClick: () => void
}

const CollapseButton: VFC<Props> = (props) => {
  return (
    <PositionAdjuster
      top={props.collapseButton.point.y}
      left={props.collapseButton.point.x}
      // Make button clickable.
      style={{ zIndex: 1 }}
    >
      <Button type="button" onClick={props.onClick} />
    </PositionAdjuster>
  )
}

export default CollapseButton

const Button = styled.button`
  width: ${diameter}px
  height: ${diameter}px
  border-radius: ${diameter / 2}px
  border-width: 0px
  background-color: ${color}
  cursor: pointer
`
