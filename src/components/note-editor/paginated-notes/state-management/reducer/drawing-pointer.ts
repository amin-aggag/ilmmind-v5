import {
  ActionOf,
  CanvasState,
  Notebook,
  Page,
  SvgPathData,
} from "../CanvasContextTypes";
import { deepCopy } from "./utils/utils";

export function reducerHandleDrawingPointerDown(
  state: CanvasState,
  action: ActionOf<"POINTER_DOWN">,
): CanvasState {
  // Trying to fix the 'drawing while zooming in/out' problem
  // if (state.zoomPointerEvents.size >= 1) return { ...state };

  return {
    ...state,
    points: action.payload.points,
    isDrawing: true,
    activePageIndex: action.payload.activePageIndex,
  };
}

export function reducerHandleDrawingPointerMove(
  state: CanvasState,
  action: ActionOf<"POINTER_MOVE">,
): CanvasState {
  return {
    ...state,
    points: action.payload.points,
    activePageIndex: action.payload.activePageIndex,
  };
}

export function reducerHandleDrawingPointerUp(
  state: CanvasState,
  action: ActionOf<"POINTER_UP">,
): CanvasState {
  // The new stroke that was just drawn
  const newPathData: SvgPathData = {
    path: action.payload.pathData,
    color: state.pen.color,
  };

  // Copying the overall state array into another (temporary) array
  const updatedState = state.states.slice(0, state.historyIndex + 1);

  const currentPage =
    updatedState[state.historyIndex][action.payload.activePageIndex];
  // Updating the page with the new stroke
  const updatedPage: Page = {
    svgData: [...currentPage.svgData, newPathData],
    textBoxes: [...currentPage.textBoxes],
  };
  // Updating the notebook with the updated page data
  const updatedNotebook: Notebook = deepCopy(updatedState[state.historyIndex]);
  updatedNotebook[action.payload.activePageIndex] = updatedPage;

  return {
    ...state,
    states: [...updatedState, updatedNotebook],
    historyIndex: state.historyIndex + 1,
    isDrawing: false,
    points: [],
  };
}
