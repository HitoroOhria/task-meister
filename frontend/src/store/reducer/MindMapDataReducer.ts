import MindMapData from '~/domain/model/MindMapData'
import DropPosition from '~/domain/model/DropPosition'

import MindMapUseCase from '~/useCase/MindMapUseCase'
import ArrowKeyUseCase from '~/useCase/ArrowKeyUseCase'
import NodeUseCase from '~/useCase/NodeUseCase'
import ShortcutUseCase from '~/useCase/ShortcutUseCase'
import CheckboxUseCase from '~/useCase/CheckboxUseCase'
import EstimateTimeUseCase from '~/useCase/EstimateTimeUseCase'

import Shortcut from '~/enum/Shortcut'

export const mindMapDataActionType = {
  // TODO Separate every Components.
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
  processKeydown: 'MIND_MAP_DATA_PROCESS_KEYDOWN',
} as const

type MindMapDataActionType = typeof mindMapDataActionType[keyof typeof mindMapDataActionType]

// TODO Write validator?
type MindMapDataPayload = Partial<{
  id: string
  width: number
  height: number
  text: string
  isInputting: boolean
  dropPosition: DropPosition
  shortcut: Shortcut
  estimateTime: number
}>

export type MindMapDataAction = {
  type: MindMapDataActionType
  payload: MindMapDataPayload
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

export const mindMapDataReducer = (state: MindMapData, action: MindMapDataAction): MindMapData => {
  const newState = { ...state }

  switch (action.type) {
    case mindMapDataActionType.init:
      return mindMapUseCase.init(newState)
    case mindMapDataActionType.selectNode:
      return nodeUseCase.select(newState, action.payload.id!)
    case mindMapDataActionType.enterNodeEditMode:
      return nodeUseCase.enterEditMode(newState, action.payload.id!)
    case mindMapDataActionType.exitNodeEditMode:
      return nodeUseCase.exitEditMode(newState, action.payload.id!)
    case mindMapDataActionType.setNodeText:
      return nodeUseCase.setText(newState, action.payload.id!, action.payload.text!)
    case mindMapDataActionType.dragAndDropNode:
      return nodeUseCase.dragAndDrop(newState, action.payload.id!, action.payload.dropPosition!)
    case mindMapDataActionType.toggleCollapse:
      return nodeUseCase.toggleCollapse(newState, action.payload.id!)
    case mindMapDataActionType.toggleCheckbox:
      return checkboxUseCase.toggleCheck(newState, action.payload.id!)
    case mindMapDataActionType.setEstimateTime:
      return estimateTimeUseCase.setMinute(
        newState,
        action.payload.id!,
        action.payload.estimateTime!
      )
    case mindMapDataActionType.enterEstimateTimeEditMode:
      return estimateTimeUseCase.enterEditMode(newState, action.payload.id!)
    case mindMapDataActionType.exitEstimateTimeEditMode:
      return estimateTimeUseCase.exitEditMode(newState, action.payload.id!)
    case mindMapDataActionType.processKeydown:
      return shortcutUseCase.handleKeydown(newState, action.payload.shortcut!)
    default:
      throw new Error(`Not defined action type. action = ${action}`)
  }
}

export default MindMapDataAction
