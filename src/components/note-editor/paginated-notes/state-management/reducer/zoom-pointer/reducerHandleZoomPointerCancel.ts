import { CanvasState } from "../../CanvasContextTypes";
import { removeZoomPointerById } from "../utils/zoom-utils";

export function reducerHandleZoomPointerCancel(
  state: CanvasState,
  pointerId: number,
): CanvasState {
  if (state.zoomPointerEvents.size === 0) {
    return { ...state };
  }

  const nextMap = removeZoomPointerById(state.zoomPointerEvents, pointerId);

  if (nextMap.size === 0) {
    return {
      ...state,
      zoomPointerEvents: new Map(),
      gestureTarget: "idle",
      zoomPointersHaveUpdated: false,
    };
  }

  if (state.gestureTarget === "zoom") {
    return {
      ...state,
      zoomPointerEvents: new Map(),
      gestureTarget: "idle",
      zoomPointersHaveUpdated: false,
    };
  }

  return {
    ...state,
    zoomPointerEvents: nextMap,
  };
}
