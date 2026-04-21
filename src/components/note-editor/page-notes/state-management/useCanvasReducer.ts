// hooks/useCanvasReducer.ts
import { useReducer } from "react";
import {
  CanvasState,
  CanvasAction,
  SvgPathData,
  Page,
  Notebook,
} from "./CanvasContextTypes";

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
  activePageIndex: 0,
};

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case "POINTER_DOWN":
      return {
        ...state,
        points: action.payload.points,
        isDrawing: true,
        activePageIndex: action.payload.activePageIndex,
      };

    case "POINTER_MOVE":
      return {
        ...state,
        points: action.payload.points,
        activePageIndex: action.payload.activePageIndex,
      };

    case "POINTER_UP": {
      // The new stroke that was just drawn
      const newPathData: SvgPathData = {
        path: action.payload.pathData,
        color: state.pen.color,
      };

      // Copying the overall state array into another (temporary) array
      const updatedState = state.states.slice();
      // Putting together the updated page data (includes old + new)
      const updatedPage: Page = [
        ...updatedState[state.historyIndex][action.payload.activePageIndex],
        newPathData,
      ];
      // Updating the notebook with the updated page data
      const updatedNotebook: Notebook = deepCopy(updatedState[state.historyIndex]);
      updatedNotebook[action.payload.activePageIndex] = updatedPage;

      return {
        ...state,
        states: [...state.states, updatedNotebook],
        historyIndex: state.historyIndex + 1,
        isDrawing: false,
        points: [],
      };
    }

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
      return {
        ...state,
        isMovingCanvas: action.payload,
      };

    case "SET_TOUCH_START":
      return {
        ...state,
        touchStart: action.payload,
      };

    case "UNDO": {
      if (
        state.historyIndex > 0 &&
        state.historyIndex <= state.states.length - 1
      ) {
        // const current_state = state.states[state.states.length - 1];
        // const current_notebook_state = current_state[current_state.length - 1];
        // const last_page =
        //   current_notebook_state[current_notebook_state.length - 1];

        return {
          ...state,
          // allPathData: last_page,
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;
    }

    case "REDO": {
      if (
        state.historyIndex > -1 &&
        state.historyIndex < state.states.length - 1
      ) {
        // const current_state = state.states[state.states.length - 1];
        // const current_notebook_state = current_state[current_state.length - 1];
        // const last_page =
        //   current_notebook_state[current_notebook_state.length - 1];

        return {
          ...state,
          // allPathData: last_page,
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;
    }

    case "SET_TEXT_MODE": {
      return {
        ...state,
        isTextMode: action.payload.isTextMode,
      };
    }

    case "ADD_PAGE": {
      const updated_notebook = state.states[state.historyIndex].slice();
      updated_notebook.push([]);

      return {
        ...state,
        states: [...state.states, updated_notebook],
        historyIndex: state.historyIndex + 1,
      };
    }

    default:
      return state;
  }
}

export function useCanvasReducer() {
  return useReducer(canvasReducer, initialState);
}

function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item)) as T;
  }
  const copy = {} as T;
  const record = obj as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    (copy as Record<string, unknown>)[key] = deepCopy(record[key]);
  }
  return copy;
}