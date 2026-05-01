import React from "react";
import { CanvasState, CanvasAction } from "./CanvasContextTypes";
import {
  reducerHandleDrawingPointerDown,
  reducerHandleDrawingPointerMove,
  reducerHandleDrawingPointerUp,
} from "./reducer/pointer";
import {
  reducerHandleSetMovingCanvas,
  reducerHandlePanCanvas,
} from "./reducer/viewport";
import { reducerHandleRedo, reducerHandleUndo } from "./reducer/history";
import { reducerHandleAddPage } from "./reducer/pages";
import { reducerHandleAddTextbox } from "./reducer/textboxes/reducerHandleAddTextbox";
import { reducerHandleUpdateTextbox } from "./reducer/textboxes/reducerHandleUpdateTextbox";
import { reducerHandleDragTextboxPointerMove } from "./reducer/textboxes/reducerHandlerDragTextboxMouseMove";
import { reducerHandleDragTextboxPointerUp } from "./reducer/textboxes/reducerHandleDragTextboxPointerUp";
import {
  reducerHandleZoomPointerCancel,
  reducerHandleZoomPointerDown,
  reducerHandleZoomPointerMove,
  reducerHandleZoomPointerUp,
} from "./reducer/zoom-pointer";

const initialState: CanvasState = {
  points: [],
  allPathData: [],
  states: [[]],
  historyIndex: 0,
  isDrawing: false,
  position: { left: 0, top: 0 },
  pen: { color: "black", size: 10 },
  isMovingCanvas: false,
  isTextMode: false,
  isDraggingTextbox: false,
  textboxInteractionPosition: null,
  isPinching: false,
  scalingValues: {
    startDistance: 0,
    startScale: 1,
  },
  zoomPointerEvents: new Map<number, React.PointerEvent>(),
  zoomPointersHaveUpdated: false,
  activePageIndex: 0,
};

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case "POINTER_DOWN":
      return reducerHandleDrawingPointerDown(state, action);

    case "POINTER_MOVE":
      return reducerHandleDrawingPointerMove(state, action);

    case "POINTER_UP":
      return reducerHandleDrawingPointerUp(state, action);

    case "SET_PEN_COLOR":
      return {
        ...state,
        pen: { ...state.pen, color: action.payload },
      };

    case "SET_PEN_SIZE":
      return {
        ...state,
        pen: { ...state.pen, size: action.payload },
      };

    case "PAN_CANVAS":
      return reducerHandlePanCanvas(state, action);

    case "SET_MOVING_CANVAS":
      return reducerHandleSetMovingCanvas(state, action);

    case "UNDO":
      return reducerHandleUndo(state);

    case "REDO":
      return reducerHandleRedo(state);

    case "SET_TEXT_MODE": {
      return {
        ...state,
        isTextMode: action.payload.isTextMode,
      };
    }

    case "ADD_PAGE":
      return reducerHandleAddPage(state);

    case "ADD_TEXTBOX": {
      // Getting the position info of this page
      const pageClicked = document.querySelector(
        `.svg-canvas[data-page-index="${action.payload.pageIndex}"]`,
      ) as Element;
      const pageClickedInfo = pageClicked.getBoundingClientRect();

      return reducerHandleAddTextbox(state, action, pageClickedInfo);
    }

    case "UPDATE_TEXTBOX":
      return reducerHandleUpdateTextbox(state, action);

    case "DRAG_TEXTBOX_POINTER_MOVE": {
      // --- Getting the position info of this page ---
      const pageClicked = document.querySelector(
        `.svg-canvas[data-page-index="${action.payload.pageIndex}"]`,
      ) as Element;
      const pageClickedInfo = pageClicked.getBoundingClientRect();

      // --- Getting the position info of the textbox ---
      const textboxBeingDragged = document.querySelector(
        `.textbox-wrapper[data-textbox-index="${action.payload.textboxIndex}"]`,
      ) as Element;
      const textboxBeingDraggedInfo =
        textboxBeingDragged.getBoundingClientRect();

      // --- Getting top position of svg-canvases-wrapper ---
      const svgCanvasesWrapper = document.getElementById(
        "svg-canvases-wrapper",
      ) as Element;
      const svgCanvasesWrapperInfo = svgCanvasesWrapper.getBoundingClientRect();

      return reducerHandleDragTextboxPointerMove(
        state,
        action,
        pageClickedInfo,
        textboxBeingDraggedInfo,
        svgCanvasesWrapperInfo,
      );
    }

    case "DRAG_TEXTBOX_POINTER_UP":
      return reducerHandleDragTextboxPointerUp(state, action);

    case "ZOOM_POINTER_DOWN":
      return reducerHandleZoomPointerDown(state, action);

    case "ZOOM_POINTER_MOVE":
      return reducerHandleZoomPointerMove(state, action);

    case "ZOOM_POINTER_UP":
      return reducerHandleZoomPointerUp(state);

    case "ZOOM_POINTER_CANCEL":
      return reducerHandleZoomPointerCancel(state);

    default:
      return state;
  }
}

export function useCanvasReducer() {
  return React.useReducer(canvasReducer, initialState);
}
