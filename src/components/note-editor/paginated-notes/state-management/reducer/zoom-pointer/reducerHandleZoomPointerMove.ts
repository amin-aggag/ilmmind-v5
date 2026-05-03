import { ActionOf, CanvasState } from "../../CanvasContextTypes";
import {
  clamp,
  distance,
  panForZoomAroundFocal,
  getNotesViewportRect,
} from "../utils/utils";

const MAX_SCALE = 4;
const MIN_SCALE = 0.1;

export function reducerHandleZoomPointerMove(
  state: CanvasState,
  action: ActionOf<"ZOOM_POINTER_MOVE">,
): CanvasState {
  if (!state.isPinching) return { ...state };

  const e = action.payload.e;
  const pointerAEvent = state.zoomPointerEvents.get(1);
  const pointerBEvent = state.zoomPointerEvents.get(2);

  if (!pointerAEvent || !pointerBEvent) return { ...state };

  const oldMidX = (pointerAEvent.clientX + pointerBEvent.clientX) / 2;
  const oldMidY = (pointerAEvent.clientY + pointerBEvent.clientY) / 2;

  const nextMap = new Map(state.zoomPointerEvents);
  if (e.pointerId === pointerAEvent.pointerId) {
    nextMap.set(1, e);
  } else if (e.pointerId === pointerBEvent.pointerId) {
    nextMap.set(2, e);
  } else {
    return { ...state };
  }

  const p1 = nextMap.get(1) as React.PointerEvent;
  const p2 = nextMap.get(2) as React.PointerEvent;
  const newMidX = (p1.clientX + p2.clientX) / 2;
  const newMidY = (p1.clientY + p2.clientY) / 2;

  const positionAfterMidPan = {
    left: state.position.left + (newMidX - oldMidX),
    top: state.position.top + (newMidY - oldMidY),
  };

  const currentDistance = distance(
    { x: p1.clientX, y: p1.clientY },
    { x: p2.clientX, y: p2.clientY },
  );

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

  const viewport = getNotesViewportRect();
  const position = viewport
    ? panForZoomAroundFocal(
        positionAfterMidPan,
        S0,
        S1,
        newMidX,
        newMidY,
        viewport,
      )
    : positionAfterMidPan;

  return {
    ...state,
    zoomPointerEvents: nextMap,
    isPinching: true,
    scalingValues: {
      startDistance: currentDistance,
      startScale: S1,
    },
    position,
  };
}
