import React, { CSSProperties, VFC } from 'react'
import { styled } from '@linaria/react'

import PositionAdjuster from '~/components/atoms/PositionAdjuster'

// unit is px.
export const diameter = 18
const color = 'blue'

type Props = {
  top: number
  left: number
  onClick: () => void
}

const CollapseButton: VFC<Props> = (props) => {
  return (
    <PositionAdjuster top={props.top} left={props.left} style={positionAdjusterStyle}>
      <Button type="button" onClick={props.onClick} />
    </PositionAdjuster>
  )
}

export default CollapseButton

const positionAdjusterStyle: CSSProperties = {
  zIndex: 1,
}

const Button = styled.button`
  width: ${diameter}px
  height: ${diameter}px
  border-radius: ${diameter / 2}px
  border-width: 0px
  background-color: ${color}
  cursor: pointer
`
