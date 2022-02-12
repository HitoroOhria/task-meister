import { createContext, Dispatch } from "react";
import MindMapDataAction from "~/store/reducer/MindMapDataReducer";
import MindMapData from "~/domain/model/MindMapData";

export const MindMapStateCtx = createContext<MindMapData>({} as MindMapData);

export const MindMapDispatchCtx = createContext<Dispatch<MindMapDataAction>>(
  {} as Dispatch<MindMapDataAction>
);
