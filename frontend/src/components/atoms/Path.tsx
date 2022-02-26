import React, { VFC } from 'react'
import { styled } from '@linaria/react'

// ratio of path to line end.
export const pathLineRatio = 0.35

const pathColor = 'blue'
const pathWidth = 3

type Props = {
  pathCommand: string
}

const Path: VFC<Props> = (props) => {
  return <SVGPath d={props.pathCommand} stroke={pathColor} strokeWidth={pathWidth} fill="none" />
}

export default Path

const SVGPath = styled.path`
  // To be behind Node.
  // Path in Node is hidden.
  z-index: -1;
`
