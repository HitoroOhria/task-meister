import React, { VFC } from 'react'
import { styled } from '@linaria/react'

type Props = {
  width?: number
  height?: number
  hidden?: boolean
}

const Spacer: VFC<Props> = (props) => {
  return <Div width={props.width} height={props.height} hidden={props.hidden} />
}

export default Spacer

type DivProps = Props

const Div = styled.div<DivProps>`
  width: ${(props) => props.width ?? 0}px;
  height: ${(props) => props.height ?? 0}px;
  display: ${(props) => (props.hidden ? 'none' : 'block')};
`
