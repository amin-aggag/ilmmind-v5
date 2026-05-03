import { CanvasState } from "../../CanvasContextTypes";

export function reducerHandleZoomPointerUp(state: CanvasState): CanvasState {
    return {
      ...state,
      zoomPointerEvents: new Map(),
      isPinching: false,
    };
  }