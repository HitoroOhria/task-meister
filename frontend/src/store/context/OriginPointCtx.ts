import { createContext, Dispatch } from "react";
import OriginPoint from "~/domain/model/OriginPoint";
import { OriginPointAction } from "~/store/reducer/OriginPointReducer";

export const OriginPointStateCtx = createContext<OriginPoint>(
  {} as OriginPoint
);

export const OriginPointDispatchCtx = createContext<Dispatch<OriginPointAction>>(
  {} as Dispatch<OriginPointAction>
);