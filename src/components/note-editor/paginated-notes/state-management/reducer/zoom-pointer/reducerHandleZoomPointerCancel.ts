import { CanvasState } from "../../CanvasContextTypes";

export function reducerHandleZoomPointerCancel(
    state: CanvasState,
  ): CanvasState {
    return {
      ...state,
      zoomPointerEvents: new Map(),
      isPinching: false,
    };
  }