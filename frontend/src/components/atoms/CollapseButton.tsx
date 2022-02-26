import React, { VFC } from 'react'

import { styled } from '@linaria/react'

import { Div as PositionAdjusterDiv } from '~/components/atoms/PositionAdjuster'

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
    <UpperPositionAdjuster top={props.top} left={props.left}>
      <Button type="button" onClick={props.onClick} />
    </UpperPositionAdjuster>
  )
}

export default CollapseButton

const UpperPositionAdjuster = styled(PositionAdjusterDiv)`
  z-index: 1;
`

const Button = styled.button`
  width: ${diameter}px
  height: ${diameter}px
  border-radius: ${diameter / 2}px
  border-width: 0px
  background-color: ${color}
  cursor: pointer
`
