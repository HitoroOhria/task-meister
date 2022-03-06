import MMindMap from '~/domain/model/MMindMap'
import DropPosition from '~/domain/model/DropPosition'

import MindMapUseCase from '~/useCase/MindMapUseCase'
import ArrowKeyUseCase from '~/useCase/ArrowKeyUseCase'
import NodeUseCase from '~/useCase/NodeUseCase'
import ShortcutUseCase from '~/useCase/ShortcutUseCase'
import CheckboxUseCase from '~/useCase/CheckboxUseCase'
import EstimateTimeUseCase from '~/useCase/EstimateTimeUseCase'

import Shortcut from '~/enum/Shortcut'
import ArrowKey from '~/enum/ArrowKeys'

type MindMapActionType = typeof mindMapActionType[keyof typeof mindMapActionType]

export const mindMapActionType = {
  init: 'MIND_MAP_DATA_INIT',
  selectNode: 'MIND_MAP_DATA_SELECT_NODE',
  enterNodeEditMode: 'MIND_MAP_DATA_ENTER_NODE_EDIT_MODE',
  exitNodeEditMode: 'MIND_MAP_DATA_EXIT_NODE_EDIT_MODE',
  setNodeText: 'MIND_MAP_DATA_SET_NODE_TEXT',
  dragAndDropNode: 'MIND_MAP_DATA_DROP_AND_DROP_NODE',
  toggleCollapse: 'MIND_MAP_DATA_TOGGLE_COLLAPSE',
  toggleCheckbox: 'MIND_MAP_DATA_TOGGLE_CHECKBOX',
  setEstimateTime: 'MIND_MAP_DATA_SET_ESTIMATE_TIME',
  enterEstimateTimeEditMode: 'MIND_MAP_DATA_ENTER_ESTIMATE_TIME_EDIT_MODE',
  exitEstimateTimeEditMode: 'MIND_MAP_DATA_EXIT_ESTIMATE_TIME_EDIT_MODE',
  processShortcut: 'MIND_MAP_DATA_PROCESS_SHORTCUT',
  processArrowKey: 'MIND_MAP_DATA_PROCESS_ARROW_KEY',
} as const

// TODO Write validator?
type MindMapPayload = Partial<{
  id: string
  width: number
  height: number
  text: string
  isInputting: boolean
  dropPosition: DropPosition
  shortcut: Shortcut
  arrowKey: ArrowKey
  estimateTime: number
}>

export type MindMapAction = {
  type: MindMapActionType
  payload: MindMapPayload
}

// TODO Refactor to use injector.
const mindMapUseCase = new MindMapUseCase()
const arrowKeyUseCase = new ArrowKeyUseCase()
const nodeUseCase = new NodeUseCase()
const checkboxUseCase = new CheckboxUseCase()
const estimateTimeUseCase = new EstimateTimeUseCase()
const shortcutUseCase = new ShortcutUseCase(
  mindMapUseCase,
  arrowKeyUseCase,
  nodeUseCase,
  checkboxUseCase,
  estimateTimeUseCase
)

export const mindMapReducer = (state: MMindMap, action: MindMapAction): MMindMap => {
  const newState = { ...state }

  switch (action.type) {
    case mindMapActionType.init:
      return mindMapUseCase.init(newState)
    case mindMapActionType.selectNode:
      return nodeUseCase.select(newState, action.payload.id!)
    case mindMapActionType.enterNodeEditMode:
      return nodeUseCase.enterEditMode(newState, action.payload.id!)
    case mindMapActionType.exitNodeEditMode:
      return nodeUseCase.exitEditMode(newState, action.payload.id!)
    case mindMapActionType.setNodeText:
      return nodeUseCase.setText(newState, action.payload.id!, action.payload.text!)
    case mindMapActionType.dragAndDropNode:
      return nodeUseCase.dragAndDrop(newState, action.payload.id!, action.payload.dropPosition!)
    case mindMapActionType.toggleCollapse:
      return nodeUseCase.toggleCollapse(newState, action.payload.id!)
    case mindMapActionType.toggleCheckbox:
      return checkboxUseCase.toggleCheck(newState, action.payload.id!)
    case mindMapActionType.setEstimateTime:
      return estimateTimeUseCase.setMinute(
        newState,
        action.payload.id!,
        action.payload.estimateTime!
      )
    case mindMapActionType.enterEstimateTimeEditMode:
      return estimateTimeUseCase.enterEditMode(newState, action.payload.id!)
    case mindMapActionType.exitEstimateTimeEditMode:
      return estimateTimeUseCase.exitEditMode(newState, action.payload.id!)
    case mindMapActionType.processShortcut:
      return shortcutUseCase.handleKeydown(newState, action.payload.shortcut!)
    case mindMapActionType.processArrowKey:
      return arrowKeyUseCase.handleKeydown(newState, action.payload.arrowKey!)
    default:
      throw new Error(`Not defined action type. action = ${action}`)
  }
}

export default MindMapAction
