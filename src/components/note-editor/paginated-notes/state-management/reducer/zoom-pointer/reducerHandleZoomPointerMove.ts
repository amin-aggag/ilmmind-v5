import { ActionOf, CanvasState } from "../../CanvasContextTypes";
import {
  clamp,
  distance,
  translateToKeepViewportPointFixed,
} from "../utils/zoom-utils";

const MAX_SCALE = 4;
const MIN_SCALE = 0.1;

export function reducerHandleZoomPointerMove(
  state: CanvasState,
  action: ActionOf<"ZOOM_POINTER_MOVE">,
): CanvasState {
  if (!state.isPinching) return { ...state };

  const contact = action.payload.contact;
  const pointerA = state.zoomPointerEvents.get(1);
  const pointerB = state.zoomPointerEvents.get(2);

  if (!pointerA || !pointerB) return { ...state };

  // The pinch midpoint before the new events. Two-finger pan is the movement of this midpoint to the new midpoint.
  const oldMidX = (pointerA.x + pointerB.x) / 2;
  const oldMidY = (pointerA.y + pointerB.y) / 2;

  const nextMap = new Map(state.zoomPointerEvents);
  if (contact.pointerId === pointerA.pointerId) {
    nextMap.set(1, contact);
  } else if (contact.pointerId === pointerB.pointerId) {
    nextMap.set(2, contact);
  } else {
    return { ...state };
  }

  const p1 = nextMap.get(1)!;
  const p2 = nextMap.get(2)!;
  const newMidX = (p1.x + p2.x) / 2;
  const newMidY = (p1.y + p2.y) / 2;

  // Translation from moving the pinch midpoint; zoom adjustment is applied on top of this below.
  const positionAfterMidPan = {
    left: state.position.left + (newMidX - oldMidX),
    top: state.position.top + (newMidY - oldMidY),
  };

  const currentDistance = distance({ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y });

  const { startDistance, startScale: S0 } = state.scalingValues;
  // Avoids dividing by 0
  if (startDistance === 0) {
    return {
      ...state,
      zoomPointerEvents: nextMap,
      position: positionAfterMidPan,
    };
  }

  const scaleRatio = currentDistance / startDistance;
  const nextScale = S0 * scaleRatio;
  const S1 = clamp(nextScale, MIN_SCALE, MAX_SCALE);

  // Keep the pinch midpoint aligned with the fingers when scale changes.
  const position = translateToKeepViewportPointFixed(
    positionAfterMidPan,
    S0,
    S1,
    newMidX,
    newMidY,
  );

  return {
    ...state,
    zoomPointerEvents: nextMap,
    isPinching: true,
    scalingValues: {
      startDistance: currentDistance,
      startScale: S1,
    },
    // Rebaseline finger span and scale each move so the next ratio is incremental (D₂/D₁)
    // while the composed scale still matches span vs the original pinch-down distance.
    position,
  };
}
