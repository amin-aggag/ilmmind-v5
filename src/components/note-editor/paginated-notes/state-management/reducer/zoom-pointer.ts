import { ActionOf, CanvasState } from "../CanvasContextTypes";

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
  if (!state.isPinching) {
    return { ...state };
  }

  const e = action.payload.e;
  const pointerAEvent = state.zoomPointerEvents.get(1) as
    | React.PointerEvent
    | undefined;
  const pointerBEvent = state.zoomPointerEvents.get(2) as
    | React.PointerEvent
    | undefined;

  if (!pointerAEvent || !pointerBEvent) {
    return { ...state };
  }

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
  const currentDistance = distance(
    { x: p1.clientX, y: p1.clientY },
    { x: p2.clientX, y: p2.clientY },
  );

  const { startDistance, startScale } = state.scalingValues;
  if (startDistance === 0) {
    return { ...state, zoomPointerEvents: nextMap };
  }

  const scaleRatio = currentDistance / startDistance;
  const nextScale = startScale * scaleRatio;
  const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);

  return {
    ...state,
    zoomPointerEvents: nextMap,
    isPinching: true,
    scalingValues: {
      startDistance: currentDistance,
      startScale: scale,
    },
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

function distance(
  touchA: {
    x: number;
    y: number;
  },
  touchB: {
    x: number;
    y: number;
  },
) {
  const dx = touchB.x - touchA.x;
  const dy = touchB.y - touchA.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function clamp(nextScale: number, minScale: number, maxScale: number) {
  if (nextScale <= minScale) return minScale;

  if (nextScale >= maxScale) return maxScale;

  return nextScale;
}
