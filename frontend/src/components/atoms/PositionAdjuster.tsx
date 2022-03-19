import React, { CSSProperties, FC, ReactNode } from 'react'

import { Property } from 'csstype'
import { styled } from '@linaria/react'

type Props = {
  position: Property.Position
  top?: number
  bottom?: number
  left?: number
  right?: number
  style?: CSSProperties
  children?: ReactNode
}

const PositionAdjuster: FC<Props> = (props) => {
  return (
    <PositionDiv
      position={props.position}
      top={props.top}
      bottom={props.bottom}
      left={props.left}
      right={props.right}
      style={props.style}
    >
      {props.children}
    </PositionDiv>
  )
}

export default PositionAdjuster

type PositionDivProps = {
  position: Property.Position
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export const PositionDiv = styled.div<PositionDivProps>`
  position: ${(props) => props.position};
  top: ${(props) => (typeof props.top === 'undefined' ? 'unset' : `${props.top}px`)};
  bottom: ${(props) => (typeof props.bottom === 'undefined' ? 'unset' : `${props.bottom}px`)};
  left: ${(props) => (typeof props.left === 'undefined' ? 'unset' : `${props.left}px`)};
  right: ${(props) => (typeof props.right === 'undefined' ? 'unset' : `${props.right}px`)};
`
