import React, { CSSProperties, FC, ReactNode } from 'react'
import { styled } from '@linaria/react'

type Props = {
  top: number
  left: number
  style?: CSSProperties
  children?: ReactNode
}

const PositionAdjuster: FC<Props> = (props) => {
  return (
    <Div top={props.top} left={props.left} style={props.style}>
      {props.children}
    </Div>
  )
}

export default PositionAdjuster

type DivProps = {
  top: number
  left: number
}

export const Div = styled.div<DivProps>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`
