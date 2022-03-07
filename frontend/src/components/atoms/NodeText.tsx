import React, { useEffect, useRef, useState, VFC } from 'react'

import { styled } from '@linaria/react'

import { backgroundColor } from '~/components/organisms/BaseNode'
import { height as checkboxHeight } from '~/components/atoms/Checkbox'

import ElementSizeCalculator from '~/util/ElementSizeCalculator'
import { numberOfLines } from '~/util/StringUtil'

// minimum width of css. unit is px.
export const minWidth = 50
export const minHeight = checkboxHeight

// line height of css. unit is px.
export const lineHeight = 18
// font size of css. unit is px.
const fontSize = 15
const fontFamily = 'monospace'
const font = `${fontSize}px ${fontFamily}`
const disableColor = 'gray'

// const
// For measure text width
export const elementSizeCalculator = new ElementSizeCalculator(font)

type Props = {
  text: string
  isInputting: boolean
  disable: boolean
  onClick: () => void
  onChange: (text: string) => void
  onBlur: () => void
}

const NodeText: VFC<Props> = (props) => {
  const textareaElement = useRef<HTMLTextAreaElement>(null)
  const [divWidth, setDivWidth] = useState<number>(0)
  const [divHeight, setDivHeight] = useState<number>(0)
  // For centering text vertically.
  const [textHeight, setTextHeight] = useState<number>(0)

  const componentDidMount = () => {
    updateAreaSize()
  }

  const updateAreaSize = () => {
    // TODO Can refactor to use BoundingClientRect?
    //   - see https://developer.mozilla.org/ja/docs/Web/API/Element/getBoundingClientRect
    updateDivWidth()
    updateDivHeight()
    updateTextHeight()
  }

  const updateDivWidth = () => {
    const textWidth = Math.ceil(elementSizeCalculator.measureLongestLineWidth(props.text))
    const width = Math.max(minWidth, textWidth)

    setDivWidth(width)
  }

  const updateDivHeight = () => {
    // TODO Maybe height changes depending on resolution of display
    const textHeight = numberOfLines(props.text) * lineHeight
    const height = Math.max(minHeight, textHeight)

    setDivHeight(height)
  }

  const updateTextHeight = () => {
    const textHeight = numberOfLines(props.text) * lineHeight

    setTextHeight(textHeight)
  }

  const handleIsInputting = () => {
    if (!textareaElement.current) return
    if (!props.isInputting) return

    textareaElement.current.focus()
    moveCaretToEnd()
  }

  const moveCaretToEnd = () => {
    if (!textareaElement.current) return

    textareaElement.current.selectionStart = props.text.length
    textareaElement.current.selectionEnd = props.text.length
  }

  useEffect(componentDidMount, [])
  useEffect(updateAreaSize, [props.text])
  useEffect(handleIsInputting, [props.isInputting])

  return (
    <TopDiv width={divWidth} height={divHeight} disable={props.disable} onClick={props.onClick}>
      {props.isInputting ? (
        <Textarea
          ref={textareaElement}
          height={textHeight}
          defaultValue={props.text}
          onChange={(e) => props.onChange(e.target.value)}
          onBlur={props.onBlur}
        />
      ) : (
        <SpanDiv height={textHeight}>
          {props.text.split('\n').map((line) => (
            <InlineBlockSpan>{line}</InlineBlockSpan>
          ))}
        </SpanDiv>
      )}
    </TopDiv>
  )
}

export default NodeText

type TopDivProps = {
  // unit is px.
  width: number
  // unit is px.
  height: number
  disable: boolean
}

const TopDiv = styled.div<TopDivProps>`
  min-width: ${minWidth}px
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  font: ${font}
  color: ${(props) => (props.disable ? disableColor : 'black')};
  line-height: ${lineHeight}px
  text-decoration: ${(props) => (props.disable ? `${disableColor} line-through` : 'none')};   
  display: flex
  align-items: center
`

type TextProps = {
  // unit is px.
  height: number
}

// TODO Let's animate!!
// see https://qiita.com/bouzuya/items/cacdab4f9989efe245ca
const Textarea = styled.textarea<TextProps>`
  padding: 0px
  min-width: inherit
  width: inherit
  height: ${(props) => props.height}px;
  font: inherit
  color: inherit
  background-color: ${backgroundColor}
  border-width: 0px
  outline: none
  resize: none
  overflow: hidden
`

const SpanDiv = styled.div<TextProps>`
  min-width: inherit
  width: inherit
  height: ${(props) => props.height}px;
  font: inherit
  color: inherit
`

const InlineBlockSpan = styled.span`
  min-width: inherit
  width: inherit
  font: inherit
  color: inherit
  display: inline-block
`
