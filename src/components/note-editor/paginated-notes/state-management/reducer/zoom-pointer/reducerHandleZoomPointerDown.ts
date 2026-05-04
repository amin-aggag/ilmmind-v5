import { ActionOf, CanvasState } from "../../CanvasContextTypes";
import { distance } from "../utils/zoom-utils";

export function reducerHandleZoomPointerDown(
  state: CanvasState,
  action: ActionOf<"ZOOM_POINTER_DOWN">,
): CanvasState {
  const numActivePointers = state.zoomPointerEvents.size;

  // Track at most two pointers for pinch; extra touches are ignored (see final return).
  if (numActivePointers < 2) {
    const zoomPointerEvents = new Map(state.zoomPointerEvents).set(
      numActivePointers + 1,
      action.payload.contact,
    );

    // Second finger: map now has two contacts — set pinch baseline so
    // startDistance is never 0 on the first ZOOM_POINTER_MOVE.
    if (numActivePointers === 1) {
      const pointerA = zoomPointerEvents.get(1)!;
      const pointerB = zoomPointerEvents.get(2)!;
      const startDistance = distance(
        { x: pointerA.x, y: pointerA.y },
        { x: pointerB.x, y: pointerB.y },
      );

      return {
        ...state,
        zoomPointerEvents,
        isPinching: true,
        scalingValues: {
          startDistance,
          startScale: state.scalingValues.startScale,
        },
        zoomPointersHaveUpdated: true,
      };
    }

    return {
      ...state,
      zoomPointerEvents,
      isPinching: true,
    };
  }

  // numActivePointers >= 2: third+ finger — leave the state unchanged.
  return {
    ...state,
  };
}
