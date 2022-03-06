import { createContext, Dispatch } from 'react'

import MindMapAction from '~/store/reducer/MindMapReducer'

import MMindMap from '~/domain/model/MMindMap'

export const MindMapStateCtx = createContext<MMindMap>({} as MMindMap)

export const MindMapDispatchCtx = createContext<Dispatch<MindMapAction>>(
  {} as Dispatch<MindMapAction>
)
