import OriginPoint from "~/domain/model/OriginPoint";

export const originPointActionType = {
  setValue: Symbol("ORIGIN_POINT_SET_VALUE"),
} as const;

type OriginPointActionType =
  typeof originPointActionType[keyof typeof originPointActionType];

export type OriginPointAction = {
  type: OriginPointActionType;
  payload: OriginPoint;
};

export const originPointReducer = (
  state: OriginPoint,
  action: OriginPointAction
): OriginPoint => {
  switch (action.type) {
    case originPointActionType.setValue:
      return { ...action.payload };
    default:
      throw new Error(`Not defined action type. action = ${action}`);
  }
};
