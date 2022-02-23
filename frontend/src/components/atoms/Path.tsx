import React, { VFC } from 'react'

// ratio of path to line end.
export const pathLineRatio = 0.35

const pathColor = 'blue'
const pathWidth = 3

type Props = {
  pathCommand: string
}

const Path: VFC<Props> = (props) => {
  return <path d={props.pathCommand} stroke={pathColor} strokeWidth={pathWidth} fill="none" />
}

export default Path
