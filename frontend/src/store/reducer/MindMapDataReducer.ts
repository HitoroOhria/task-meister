import MindMapData from '~/domain/model/MindMapData'
import DropPosition from '~/domain/model/DropPosition'

import MindMapUseCase from '~/useCase/MindMapUseCase'
import ArrowKeyUseCase from '~/useCase/ArrowKeyUseCase'
import ShortcutUseCase from '~/useCase/ShortcutUseCase'
import CheckboxUseCase from '~/useCase/CheckboxUseCase'

import Shortcut from '~/enum/Shortcut'

export const mindMapDataActionType = {
  // TODO Separate every Components.
  init: 'MIND_MAP_DATA_INIT',
  selectNode: 'MIND_MAP_DATA_SELECT_NODE',
  enterNodeEditMode: 'MIND_MAP_DATA_ENTER_NODE_EDIT_MODE',
  exitNodeEditMode: 'MIND_MAP_DATA_EXIT_NODE_EDIT_MODE',
  processNodeTextChanges: 'MIND_MAP_DATA_PROCESS_NODE_TEXT_CHANGES',
  processNodeDrop: 'MIND_MAP_DATA_PROCESS_NODE_DROP',
  updateRelationshipLine: 'MIND_MAP_DATA_UPDATE_RELATIONSHIP_LINE',
  updateAllRelationshipLine: 'MIND_MAP_DATA_UPDATE_ALL_RELATIONSHIP_LINE',
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
const checkboxUseCase = new CheckboxUseCase()
const shortcutUseCase = new ShortcutUseCase(mindMapUseCase, arrowKeyUseCase, checkboxUseCase)

export const mindMapDataReducer = (state: MindMapData, action: MindMapDataAction): MindMapData => {
  const newState = { ...state }

  switch (action.type) {
    case mindMapDataActionType.init:
      return mindMapUseCase.init(newState)
    case mindMapDataActionType.selectNode:
      return mindMapUseCase.selectNode(newState, action.payload.id!)
    case mindMapDataActionType.enterNodeEditMode:
      return mindMapUseCase.enterNodeEditMode(newState, action.payload.id!)
    case mindMapDataActionType.exitNodeEditMode:
      return mindMapUseCase.exitNodeEditMode(newState, action.payload.id!)
    case mindMapDataActionType.processNodeTextChanges:
      return mindMapUseCase.processNodeTextChanges(
        newState,
        action.payload.id!,
        action.payload.text!
      )
    case mindMapDataActionType.processNodeDrop:
      return mindMapUseCase.processNodeDrop(
        newState,
        action.payload.id!,
        action.payload.dropPosition!
      )
    case mindMapDataActionType.toggleCollapse:
      return mindMapUseCase.toggleCollapse(newState, action.payload.id!)
    case mindMapDataActionType.updateRelationshipLine:
      return mindMapUseCase.updateRelationshipLine(
        newState,
        action.payload.id!,
        action.payload.text!
      )
    case mindMapDataActionType.updateAllRelationshipLine:
      return mindMapUseCase.updateAllRelationshipLine(newState)
    case mindMapDataActionType.toggleCheckbox:
      return checkboxUseCase.toggleCheck(newState, action.payload.id!)
    case mindMapDataActionType.setEstimateTime:
      return mindMapUseCase.setEstimateTime(
        newState,
        action.payload.id!,
        action.payload.estimateTime!
      )
    case mindMapDataActionType.enterEstimateTimeEditMode:
      return mindMapUseCase.enterEstimateTimeEditMode(newState, action.payload.id!)
    case mindMapDataActionType.exitEstimateTimeEditMode:
      return mindMapUseCase.exitEstimateTimeEditMode(newState, action.payload.id!)
    case mindMapDataActionType.processKeydown:
      return shortcutUseCase.handleKeydown(newState, action.payload.shortcut!)
    default:
      throw new Error(`Not defined action type. action = ${action}`)
  }
}

export default MindMapDataAction
