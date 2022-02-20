import React, { FC, ReactNode } from 'react'
import { styled } from '@linaria/react'

type PositionAdjusterProps = {
  top: number
  left: number
  children?: ReactNode
}

type PositionAdjusterDivProps = {
  top: number
  left: number
}

const PositionAdjusterDiv = styled.div<PositionAdjusterDivProps>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`

const PositionAdjuster: FC<PositionAdjusterProps> = (props) => {
  return (
    <PositionAdjusterDiv top={props.top} left={props.left}>
      {props.children}
    </PositionAdjusterDiv>
  )
}

export default PositionAdjuster
