import React, { VFC } from 'react'

import { styled } from '@linaria/react'
import { Card } from '@nextui-org/react'
import { MdKeyboardReturn, MdKeyboardTab } from 'react-icons/md'
import { BiCommand } from 'react-icons/bi'
import { BsPlus } from 'react-icons/bs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faC, faE, faT } from '@fortawesome/free-solid-svg-icons'

import ShortcutExplanationCardRow, {
  explainWidth,
  shortcutWidth,
  space,
} from '~/components/organisms/ShortcutExplanationCardRow'

// Margin from window. Unit is px.
const margin = 20

// Measured value. Unit is px.
const cardPadding = 20
// Width of Card. Unit is px.
const cardWidth = cardPadding * 2 + shortcutWidth + space + explainWidth

type Props = {}

const ShortcutExplanationCard: VFC<Props> = (props) => {
  return (
    <PositionFixed>
      <Card css={{ width: cardWidth }}>
        <ShortcutExplanationCardRow text={'ノードを追加'}>
          <MdKeyboardTab />
        </ShortcutExplanationCardRow>
        <ShortcutExplanationCardRow text={'ノードを下に追加'}>
          <MdKeyboardReturn />
        </ShortcutExplanationCardRow>
        <ShortcutExplanationCardRow text={'テキストを編集'}>
          <BiCommand />
          <BsPlus />
          <FontAwesomeIcon icon={faE} />
        </ShortcutExplanationCardRow>
        <ShortcutExplanationCardRow text={'✅ 表示の切り替え'}>
          <FontAwesomeIcon icon={faC} />
        </ShortcutExplanationCardRow>
        <ShortcutExplanationCardRow text={'✔️ の切り替え'}>
          <BiCommand />
          <BsPlus />
          <MdKeyboardReturn />
        </ShortcutExplanationCardRow>
        <ShortcutExplanationCardRow text={'見積り時間を編集'}>
          <FontAwesomeIcon icon={faT} />
        </ShortcutExplanationCardRow>
      </Card>
    </PositionFixed>
  )
}

export default ShortcutExplanationCard

const PositionFixed = styled.div`
  position: fixed
  top: ${margin}px
  right: ${margin}px
  z-index: 1
`
