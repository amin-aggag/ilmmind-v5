import { ActionOf, CanvasState } from "../../CanvasContextTypes";
import { distance } from "../utils/zoom-utils";

export function reducerHandleZoomPointerDown(
  state: CanvasState,
  action: ActionOf<"ZOOM_POINTER_DOWN">,
): CanvasState {
  const contact = action.payload.contact;
  if (contact.pointerType !== "touch") {
    return { ...state };
  }

  const numActivePointers = state.zoomPointerEvents.size;

  if (numActivePointers >= 2) {
    return { ...state };
  }

  const zoomPointerEvents = new Map(state.zoomPointerEvents).set(
    numActivePointers + 1,
    contact,
  );

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
      gestureTarget: "zoom",
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
    gestureTarget: "pending",
    zoomPointersHaveUpdated: true,
  };
}
