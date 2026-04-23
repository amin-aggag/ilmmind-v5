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

      const currentPage =
        updatedState[state.historyIndex][action.payload.activePageIndex];
      // Updating the page with the new stroke
      const updatedPage: Page = {
        svgData: [...currentPage.svgData, newPathData],
        textBoxes: [...currentPage.textBoxes],
      };
      // Updating the notebook with the updated page data
      const updatedNotebook: Notebook = deepCopy(
        updatedState[state.historyIndex],
      );
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
        return {
          ...state,
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
        return {
          ...state,
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
      updated_notebook.push({
        svgData: [],
        textBoxes: [],
      });

      return {
        ...state,
        states: [...state.states, updated_notebook],
        historyIndex: state.historyIndex + 1,
      };
    }

    case "ADD_TEXTBOX": {
      // Getting the position info of this page
      const pageClicked = document.querySelector(
        `.svg-canvas[data-page-index="${action.payload.pageIndex}"]`,
      ) as Element;
      const pageClickedInfo = pageClicked.getBoundingClientRect();

      // Copying the overall state array into another (temporary) array
      const updatedState = state.states.slice();
      const currentPage =
        updatedState[state.historyIndex][action.payload.pageIndex];

      // Updating the current page with the new textbox
      const updatedPage: Page = {
        svgData: [...currentPage.svgData],
        textBoxes: [
          ...currentPage.textBoxes,
          {
            textData: undefined,
            position: toPageRelativePosition(action.payload.position, pageClickedInfo),
            size: action.payload.size
          },
        ],
      };

      // Updating the notebook with the updated page data
      const updatedNotebook: Notebook = deepCopy(
        updatedState[state.historyIndex],
      );
      updatedNotebook[action.payload.pageIndex] = updatedPage;

      return {
        ...state,
        states: [...state.states, updatedNotebook],
        historyIndex: state.historyIndex + 1,
        isTextMode: false
      };
    }

    case "UPDATE_TEXTBOX": {
      // Copying the overall state array into another (temporary) array
      const updatedState = state.states.slice();

      // Getting the current page and textbox states
      const updatedPage = deepCopy(
        updatedState[state.historyIndex][action.payload.pageIndex]);
      const currentTextboxState = updatedPage.textBoxes[action.payload.textboxIndex];

      // Updating the current page with the updated textbox data
      updatedPage.textBoxes[action.payload.textboxIndex] = {
        ...currentTextboxState,
        textData: deepCopy(action.payload.newTextBoxData),
      };

      // Updating the notebook with the updated page data
      const updatedNotebook: Notebook = deepCopy(
        updatedState[state.historyIndex],
      );
      updatedNotebook[action.payload.pageIndex] = updatedPage;

      return {
        ...state,
        states: [...state.states, updatedNotebook],
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

const toPageRelativePosition = (
  position: {
    top: number;
    left: number;
  },
  pageRect: DOMRect,
) => ({
  ...position,
  top: position.top - pageRect.top,
  left: position.left - pageRect.left,
});
