import OriginPoint from "~/domain/model/OriginPoint";

export type OriginPointAction = { type: "setValue"; value: OriginPoint };

export const originPointReducer = (
  state: OriginPoint,
  action: OriginPointAction
): OriginPoint => {
  switch (action.type) {
    case "setValue":
      return { ...action.value };
    default:
      throw new Error(`Not defined action type. action = ${action}`);
  }
};
