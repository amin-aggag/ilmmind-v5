import { ActionOf, CanvasState } from "../CanvasContextTypes";
import { getNotesViewportRect } from "./utils/utils";

const MAX_SCALE = 4;
const MIN_SCALE = 0.1;

export function reducerHandleZoomPointerDown(
  state: CanvasState,
  action: ActionOf<"ZOOM_POINTER_DOWN">,
): CanvasState {
  const numActivePointers = state.zoomPointerEvents.size;

  if (numActivePointers < 2) {
    const zoomPointerEvents = new Map(state.zoomPointerEvents).set(
      numActivePointers + 1,
      action.payload.e,
    );

    // Second finger: map now has two contacts — set pinch baseline so
    // startDistance is never 0 on the first ZOOM_POINTER_MOVE.
    if (numActivePointers === 1) {
      const pointerAEvent = zoomPointerEvents.get(1) as React.PointerEvent;
      const pointerBEvent = zoomPointerEvents.get(2) as React.PointerEvent;
      const startDistance = distance(
        { x: pointerAEvent.clientX, y: pointerAEvent.clientY },
        { x: pointerBEvent.clientX, y: pointerBEvent.clientY },
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
      isPinching: false,
    };
  }

  return {
    ...state,
  };
}

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

export function reducerHandleZoomPointerUp(state: CanvasState): CanvasState {
  return {
    ...state,
    zoomPointerEvents: new Map(),
    isPinching: false,
  };
}

export function reducerHandleZoomPointerCancel(
  state: CanvasState,
): CanvasState {
  return {
    ...state,
    zoomPointerEvents: new Map(),
    isPinching: false,
  };
}

/** Keeps the pinch midpoint fixed in `pages-window` while scale changes (translate + scale, origin 0 0). */
function panForZoomAroundFocal(
  position: CanvasState["position"],
  scaleBefore: number,
  scaleAfter: number,
  focalClientX: number,
  focalClientY: number,
  viewport: DOMRect,
): CanvasState["position"] {
  if (scaleBefore <= 0) return position;
  const pfx = focalClientX - viewport.left;
  const pfy = focalClientY - viewport.top;
  const ratio = scaleAfter / scaleBefore;
  return {
    left: pfx - (pfx - position.left) * ratio,
    top: pfy - (pfy - position.top) * ratio,
  };
}

function distance(
  touchA: {
    x: number;
    y: number;
  },
  touchB: {
    x: number;
    y: number;
  },
): number {
  const dx = touchB.x - touchA.x;
  const dy = touchB.y - touchA.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function clamp(nextScale: number, minScale: number, maxScale: number): number {
  if (nextScale <= minScale) return minScale;

  if (nextScale >= maxScale) return maxScale;

  return nextScale;
}
