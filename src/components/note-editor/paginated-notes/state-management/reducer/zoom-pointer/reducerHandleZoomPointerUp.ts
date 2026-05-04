import { CanvasState } from "../../CanvasContextTypes";

export function reducerHandleZoomPointerUp(state: CanvasState): CanvasState {
  // End pinch: drop tracked contacts so a new pinch starts from a clean pair.
  return {
    ...state,
    zoomPointerEvents: new Map(),
    isPinching: false,
  };
}
