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
  const contact = action.payload.contact;
  if (contact.pointerType !== "touch") {
    return { ...state };
  }

  if (state.gestureTarget === "pending" && state.zoomPointerEvents.size === 1) {
    const [[key, stored]] = [...state.zoomPointerEvents.entries()];
    if (stored.pointerId !== contact.pointerId) return { ...state };
    const nextMap = new Map(state.zoomPointerEvents);
    nextMap.set(key, contact);
    return { ...state, zoomPointerEvents: nextMap };
  }

  if (state.gestureTarget !== "zoom") return { ...state };

  const pointerA = state.zoomPointerEvents.get(1);
  const pointerB = state.zoomPointerEvents.get(2);

  if (!pointerA || !pointerB) return { ...state };

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

  const positionAfterMidPan = {
    left: state.position.left + (newMidX - oldMidX),
    top: state.position.top + (newMidY - oldMidY),
  };

  const currentDistance = distance({ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y });

  const { startDistance, startScale: S0 } = state.scalingValues;
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
    gestureTarget: "zoom",
    scalingValues: {
      startDistance: currentDistance,
      startScale: S1,
    },
    position,
  };
}
