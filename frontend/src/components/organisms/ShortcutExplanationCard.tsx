import React, { useState, VFC } from 'react'

import { styled } from '@linaria/react'
import { Card } from '@nextui-org/react'
import { MdClose, MdKeyboardReturn, MdKeyboardTab, MdMenu } from 'react-icons/md'
import { BiCommand } from 'react-icons/bi'
import { BsPlus } from 'react-icons/bs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faC, faE, faT } from '@fortawesome/free-solid-svg-icons'

import ShortcutExplanationCardRow, {
  explainWidth,
  shortcutWidth,
  space,
} from '~/components/organisms/ShortcutExplanationCardRow'

// Size fo button are. Make larger than button to make click area wider. Unit is px.
const buttonAreaSize = 35
// Size of button. Unit is px.
const buttonSize = 20

// Margin from window. Unit is px.
const margin = 20

// Width of Content when open. Unit is px.
const openContentWidth = shortcutWidth + space + explainWidth + buttonAreaSize

type Props = {}

const ShortcutExplanationCard: VFC<Props> = (props) => {
  const [open, setOpen] = useState<boolean>(true)

  return (
    <PositionFixed>
      <Card>
        <Content width={open ? openContentWidth : buttonAreaSize}>
          {open && (
            <div>
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
            </div>
          )}
          <CollapseButton onClick={() => setOpen(!open)}>
            {open ? <MdClose size={buttonSize} /> : <MdMenu size={buttonSize} />}
          </CollapseButton>
        </Content>
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

type ContentProps = {
  width: number
}

const Content = styled.div<ContentProps>`
  width: ${(props) => props.width}px;
  display: flex;
`

const CollapseButton = styled.button`
  width: ${buttonAreaSize}px
  height: ${buttonAreaSize}px
  background-color: white
  border: none
  cursor: pointer
`
