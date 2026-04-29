import { ActionOf, CanvasState } from "../CanvasContextTypes";

const MAX_SCALE = 4;
const MIN_SCALE = 0.1;

export function reducerHandleZoomPointerDown(
  state: CanvasState,
  action: ActionOf<"ZOOM_POINTER_DOWN">,
): CanvasState {
  const numActivePointers = state.zoomPointerEvents.size;

  if (numActivePointers < 2) {
    return {
      ...state,
      zoomPointerEvents: new Map(state.zoomPointerEvents).set(
        numActivePointers + 1,
        action.payload.e,
      ),
      // isPinching is set to true when the second pointer event is being
      // added, i.e. when the first one has already been added and
      // numActivePointers is equal to 1
      isPinching: numActivePointers === 1 ? true : false,
    };
  }

  if (numActivePointers === 2 || state.isPinching === true) {
    const activeZoomPointerEvents = state.zoomPointerEvents;
    const pointerAEvent = activeZoomPointerEvents.get(1) as React.PointerEvent;
    const pointerBEvent = activeZoomPointerEvents.get(2) as React.PointerEvent;

    const pointerA = {
      x: pointerAEvent?.clientX,
      y: pointerAEvent?.clientY,
    };

    const pointerB = {
      x: pointerBEvent?.clientX,
      y: pointerBEvent?.clientY,
    };

    return {
      ...state,
      isPinching: true,
      scalingValues: {
        startDistance: distance(pointerA, pointerB),
        startScale: 1,
      },
      zoomPointersHaveUpdated: true,
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
  if (!state.isPinching)
    return {
      ...state,
    };

  const activeZoomPointerEvents = state.zoomPointerEvents;
  const pointerAEvent = activeZoomPointerEvents.get(1) as React.PointerEvent;
  let pointerBEvent = activeZoomPointerEvents.get(2) as React.PointerEvent;

  if (action.payload.e.pointerId === pointerAEvent.pointerId) {
    return {
      ...state,
      zoomPointerEvents: new Map(state.zoomPointerEvents).set(
        1,
        action.payload.e,
      ),
    };
  }

  // If the incoming pointer event is the updated information of
  // the second pointer, the below code can run as the updated
  // information of both pointers is now present.
  if (action.payload.e.pointerId === pointerBEvent.pointerId) {
    pointerBEvent = action.payload.e;

    const startScale = state.scalingValues.startScale;
    const startDistance = state.scalingValues.startDistance;

    let currentDistance = startDistance;
    if (state.isPinching) {
      currentDistance = distance(
        {
          x: pointerAEvent.clientX,
          y: pointerAEvent.clientY,
        },
        {
          x: pointerBEvent.clientX,
          y: pointerBEvent.clientY,
        },
      );
    }

    if (startDistance === 0)
      return {
        ...state,
      }; // avoids dividing by 0

    const scaleRatio = currentDistance / startDistance;

    const nextScale = startScale * scaleRatio;

    const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);

    return {
      ...state,
      isPinching: true,
      scalingValues: {
        startDistance: currentDistance,
        startScale: scale,
      },
    };
  }

  return {
    ...state,
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
