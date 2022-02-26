import React, { VFC } from 'react'

import { Checkbox as NCheckbox } from '@nextui-org/react'
import { styled } from '@linaria/react'
import MCheckbox from '~/domain/model/MCheckbox'

// unit is px.
export const width = 25
// unit is px.
export const height = 25

type Props = {
  checkbox: MCheckbox
  onClick: () => void
}

const Checkbox: VFC<Props> = (props) => {
  return (
    <Div hidden={props.checkbox.hidden} onClick={props.onClick}>
      <NCheckbox checked={props.checkbox.checked} />
    </Div>
  )
}

export default Checkbox

type DivProps = {
  hidden: boolean
}

const Div = styled.div<DivProps>`
  width: ${width}px
  height: ${height}px
  display: ${(props) => (props.hidden ? 'none' : 'flex')};
  justify-content: center
  align-items: center
`
