import React, { useEffect, useRef, useState, VFC } from 'react'

import { css } from '@linaria/core'
import { styled } from '@linaria/react'
import { MdClose, MdKeyboardReturn, MdKeyboardTab, MdMenu } from 'react-icons/md'
import { BiCommand } from 'react-icons/bi'
import { BsPlus } from 'react-icons/bs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faC, faE, faT } from '@fortawesome/free-solid-svg-icons'

import ShortcutExplanationCardRow, {
  explainWidth,
  rowHeight,
  rowMargin,
  shortcutWidth,
  space,
} from '~/components/organisms/ShortcutExplanationCardRow'
import PositionAdjuster from '~/components/atoms/PositionAdjuster'

// Contents of shortcuts.
// Element of contents has text and icons.
const contents = [
  {
    text: 'ノードを追加',
    icons: <MdKeyboardTab />,
  },
  {
    text: 'ノードを下に追加',
    icons: <MdKeyboardReturn />,
  },
  {
    text: 'テキストを編集',
    icons: (
      <>
        <BiCommand />
        <BsPlus />
        <FontAwesomeIcon icon={faE} />
      </>
    ),
  },
  {
    text: '✅ 表示の切り替え',
    icons: <FontAwesomeIcon icon={faC} />,
  },
  {
    text: '✔️ の切り替え',
    icons: (
      <>
        <BiCommand />
        <BsPlus />
        <MdKeyboardReturn />
      </>
    ),
  },
  {
    text: '見積り時間を編集',
    icons: <FontAwesomeIcon icon={faT} />,
  },
]

// Margin from window. Unit is px.
const marginFromWindow = 20

// Size of closing/menu icon. Unit ix px.
const collapseIconSize = 20

// Padding of explanation card. Unit ix px.
const explanationCardPadding = 10
// Size of explanation card when close. Unit ix px.
const closeExplanationCardSize = explanationCardPadding * 2 + collapseIconSize

// Width of Content when open. Unit is px.
const openContentWidth = shortcutWidth + space + explainWidth + collapseIconSize
// Height of Content when open. Unit is px.
const openContentHeight = (rowHeight + rowMargin * 2) * contents.length

// Width of explanation card when open. Unit is px.
const openExplanationCardWidth = explanationCardPadding * 2 + openContentWidth
// Height of explanation card when open. Unit is px.
const openExplanationCardHeight = explanationCardPadding * 2 + openContentHeight

const initOpen = false

const ShortcutExplanationCard: VFC = () => {
  const [open, setOpen] = useState<boolean>(initOpen)
  const explanationCardRef = useRef<HTMLDivElement>(null)

  const removeCollapseClass = () => {
    const removeClass = initOpen ? openCard : closeCard
    explanationCardRef.current!.className = explanationCardRef.current!.className.replace(
      removeClass,
      ''
    )
  }

  // Prevent animation when open browser.
  useEffect(removeCollapseClass, [])

  return (
    <PositionAdjuster
      position={'fixed'}
      top={marginFromWindow}
      right={marginFromWindow}
      style={{ zIndex: 1 }}
    >
      <ExplanationCard
        ref={explanationCardRef}
        className={open ? openCard : closeCard}
        width={open ? openExplanationCardWidth : closeExplanationCardSize}
        height={open ? openExplanationCardHeight : closeExplanationCardSize}
      >
        <div
          // Do not write size using styled.
          // Not working overflow hidden.
          // TODO Whey? What is the different? I'm curious.
          //   - For example, const Content = styled<Props>`width: ${props => props.width}; height: ${props => props.height}`
          style={{
            width: open ? openContentWidth : closeExplanationCardSize,
            height: open ? openContentHeight : closeExplanationCardSize,
          }}
        >
          {open &&
            contents.map((content) => (
              <ShortcutExplanationCardRow key={content.text} text={content.text}>
                {content.icons}
              </ShortcutExplanationCardRow>
            ))}
        </div>
        <PositionAdjuster
          position={'absolute'}
          top={explanationCardPadding}
          right={explanationCardPadding}
        >
          <CollapseButton id="button" onClick={() => setOpen(!open)}>
            {open ? <MdClose size={collapseIconSize} /> : <MdMenu size={collapseIconSize} />}
          </CollapseButton>
        </PositionAdjuster>
      </ExplanationCard>
    </PositionAdjuster>
  )
}

export default ShortcutExplanationCard

type ExplanationCardProps = {
  width: number
  height: number
}

const ExplanationCard = styled.div<ExplanationCardProps>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  padding: ${explanationCardPadding}px
  border-radius: 14px
  background-color: white
  box-shadow: rgba(0, 0, 0, 0.15) 0px 8px 30px 0px
  overflow: hidden
`

const openCard = css`
  animation: 0.3s ease-in verticalOpen, 0.3s ease-in horizontalOpen;

  @keyframes verticalOpen {
    from {
      height: ${closeExplanationCardSize}px;
    }

    to {
      height: ${openExplanationCardHeight}px;
    }
  }

  @keyframes horizontalOpen {
    from {
      width: ${closeExplanationCardSize}px;
    }

    to {
      width: ${openExplanationCardWidth}px;
    }
  }
`

const closeCard = css`
  animation: 0.2s ease-out verticalClose, 0.2s ease-out horizontalClose;

  @keyframes verticalClose {
    from {
      height: ${openExplanationCardHeight}px;
    }

    to {
      height: ${closeExplanationCardSize}px;
    }
  }

  @keyframes horizontalClose {
    from {
      width: ${openExplanationCardWidth}px;
    }

    to {
      width: ${closeExplanationCardSize}px;
    }
  }
`

const CollapseButton = styled.button`
  padding: 0
  background-color: transparent
  border: none;
  // To remove vertical space in button.
  display: flex
  cursor: pointer
`
