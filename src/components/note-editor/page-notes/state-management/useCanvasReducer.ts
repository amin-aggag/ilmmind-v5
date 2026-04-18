// hooks/useCanvasReducer.ts
import { useReducer } from "react";
import {
  CanvasState,
  CanvasAction,
  SvgPathData,
  Point,
} from "./CanvasContextTypes";

const initialState: CanvasState = {
  points: [],
  allPathData: [],
  states: [[]],
  index: 0,
  isDrawing: false,
  position: { left: 0, top: 0 },
  pen: { color: "black", size: 10 },
  isMovingCanvas: false,
  touchStart: null,
  isTextMode: false,
};

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case "POINTER_DOWN":
      return {
        ...state,
        points: action.payload.points,
        isDrawing: true,
      };

    case "POINTER_MOVE":
      return {
        ...state,
        points: action.payload.points,
      };

    case "POINTER_UP": {
      const newPathData: SvgPathData = {
        path: action.payload.pathData,
        color: state.pen.color,
      };
      const updatedAllPathData = [...state.allPathData, newPathData];
      const temporaryState = state.states.slice(0, state.index + 1);

      return {
        ...state,
        allPathData: updatedAllPathData,
        states: [...temporaryState, updatedAllPathData],
        index: state.index + 1,
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
      if (state.index > 0 && state.index <= state.states.length - 1) {
        return {
          ...state,
          allPathData: state.states[state.index - 1],
          index: state.index - 1,
        };
      }
      return state;
    }

    case "REDO": {
      if (state.index > -1 && state.index < state.states.length - 1) {
        return {
          ...state,
          allPathData: state.states[state.index + 1],
          index: state.index + 1,
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
      const tempPathData: any = deepCopy(state.allPathData);
      let temporaryState = state.states.slice(0, state.index + 1);
      let current_index = state.index;
      return {
        ...state,
        allPathData: [...tempPathData, []],
        states: [...temporaryState, [...tempPathData, []]],
        index: current_index + 1,
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