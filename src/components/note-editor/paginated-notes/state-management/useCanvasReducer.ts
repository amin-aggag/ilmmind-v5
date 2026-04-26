import { useReducer } from "react";
import { CanvasState, CanvasAction } from "./CanvasContextTypes";
import {
  reducerHandlePointerDown,
  reducerHandlePointerMove,
  reducerHandlerPointerUp,
} from "./reducer/pointer";
import {
  reducerHandleSetTouchStart,
  reducerHandleSetMovingCanvas,
} from "./reducer/viewport";
import { reducerHandleRedo, reducerHandleUndo } from "./reducer/history";
import { reducerHandleAddPage } from "./reducer/pages";
import { reducerHandleAddTextbox } from "./reducer/textboxes/reducerHandleAddTextbox";
import { reducerHandleUpdateTextbox } from "./reducer/textboxes/reducerHandleUpdateTextbox";
import { reducerHandlerDragTextboxPointerMove } from "./reducer/textboxes/reducerHandlerDragTextboxMouseMove";

const initialState: CanvasState = {
  points: [],
  allPathData: [],
  states: [[]],
  historyIndex: 0,
  isDrawing: false,
  position: { left: 0, top: 0 },
  pen: { color: "black", size: 10 },
  isMovingCanvas: false,
  touchStart: null,
  isTextMode: false,
  isDraggingTextbox: false,
  activePageIndex: 0,
};

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case "POINTER_DOWN":
      return reducerHandlePointerDown(state, action);

    case "POINTER_MOVE":
      return reducerHandlePointerMove(state, action);

    case "POINTER_UP":
      return reducerHandlerPointerUp(state, action);

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
      return {
        ...state,
        position: action.payload,
      };

    case "SET_MOVING_CANVAS":
      return reducerHandleSetMovingCanvas(state, action);

    case "SET_TOUCH_START":
      return reducerHandleSetTouchStart(state, action);

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

    case "ADD_TEXTBOX":
      return reducerHandleAddTextbox(state, action);

    case "UPDATE_TEXTBOX":
      return reducerHandleUpdateTextbox(state, action);

    case "DRAG_TEXTBOX_POINTER_MOVE":
      return reducerHandlerDragTextboxPointerMove(state, action);

    default:
      return state;
  }
}

export function useCanvasReducer() {
  return useReducer(canvasReducer, initialState);
}
