import { CanvasState } from "../../CanvasContextTypes";
import { inkSeedFromZoomContact } from "../../../utils/inkSeedFromZoomContact";

export function reducerHandleResolvePendingGesture(
  state: CanvasState,
): CanvasState {
  if (state.gestureTarget !== "pending" || state.zoomPointerEvents.size !== 1) {
    return state;
  }
  const contact = state.zoomPointerEvents.get(1);
  if (!contact) return state;

  if (state.isTextMode) {
    return {
      ...state,
      gestureTarget: "idle",
      zoomPointerEvents: new Map(),
      zoomPointersHaveUpdated: false,
    };
  }

  const seed = inkSeedFromZoomContact(contact);
  if (!seed) {
    return {
      ...state,
      gestureTarget: "idle",
      zoomPointerEvents: new Map(),
      zoomPointersHaveUpdated: false,
    };
  }

  return {
    ...state,
    gestureTarget: "draw",
    zoomPointerEvents: new Map(),
    points: seed.points,
    isDrawing: true,
    activePageIndex: seed.activePageIndex,
    activeDrawPointerId: contact.pointerId,
    zoomPointersHaveUpdated: false,
  };
}
