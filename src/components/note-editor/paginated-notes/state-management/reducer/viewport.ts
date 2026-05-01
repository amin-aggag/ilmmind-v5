import { ActionOf, CanvasState } from "../CanvasContextTypes";

export function reducerHandlePanCanvas(
  state: CanvasState,
  action: ActionOf<"PAN_CANVAS">,
): CanvasState {
  return {
    ...state,
    position: action.payload,
  };
}

export function reducerHandleSetMovingCanvas(
  state: CanvasState,
  action: ActionOf<"SET_MOVING_CANVAS">,
): CanvasState {
  return {
    ...state,
    isMovingCanvas: action.payload,
  };
}