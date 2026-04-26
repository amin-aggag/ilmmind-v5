import { ActionOf, CanvasState } from "../CanvasContextTypes";

export function reducerHandlePanCanvas(
  state: CanvasState,
  action: ActionOf<"PAN_CANVAS">,
) {
  return {
    ...state,
    position: action.payload,
  };
}

export function reducerHandleSetMovingCanvas(
  state: CanvasState,
  action: ActionOf<"SET_MOVING_CANVAS">,
) {
  return {
    ...state,
    isMovingCanvas: action.payload,
  };
}

export function reducerHandleSetTouchStart(
  state: CanvasState,
  action: ActionOf<"SET_TOUCH_START">,
) {
  return {
    ...state,
    touchStart: action.payload,
  };
}
