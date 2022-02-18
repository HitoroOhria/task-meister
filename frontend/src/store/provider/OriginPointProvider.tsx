import React, { FC, ReactNode, useReducer } from "react";
import { originPointReducer } from "~/store/reducer/OriginPointReducer";
import {
  OriginPointDispatchCtx,
  OriginPointStateCtx,
} from "~/store/context/OriginPointCtx";
import { newOriginPoint } from "~/domain/model/OriginPoint";

type Props = {
  children?: ReactNode;
};

const initState = newOriginPoint(0, 0, 0, 0);

const OriginPointProvider: FC<Props> = (props) => {
  const [originPoint, dispatchOriginPoint] = useReducer(
    originPointReducer,
    initState
  );

  return (
    <OriginPointDispatchCtx.Provider value={dispatchOriginPoint}>
      <OriginPointStateCtx.Provider value={originPoint}>
        {props.children}
      </OriginPointStateCtx.Provider>
    </OriginPointDispatchCtx.Provider>
  );
};

export default OriginPointProvider;
