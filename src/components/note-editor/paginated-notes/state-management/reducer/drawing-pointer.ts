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
  if (state.gestureTarget !== "idle" || state.isDrawing) {
    return { ...state };
  }

  return {
    ...state,
    points: action.payload.points,
    isDrawing: true,
    activePageIndex: action.payload.activePageIndex,
    activeDrawPointerId: null,
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
  const newPathData: SvgPathData = {
    path: action.payload.pathData,
    color: state.pen.color,
  };

  const updatedState = state.states.slice(0, state.historyIndex + 1);

  const currentPage =
    updatedState[state.historyIndex][action.payload.activePageIndex];
  const updatedPage: Page = {
    svgData: [...currentPage.svgData, newPathData],
    textBoxes: [...currentPage.textBoxes],
  };
  const updatedNotebook: Notebook = deepCopy(updatedState[state.historyIndex]);
  updatedNotebook[action.payload.activePageIndex] = updatedPage;

  return {
    ...state,
    states: [...updatedState, updatedNotebook],
    historyIndex: state.historyIndex + 1,
    isDrawing: false,
    points: [],
    gestureTarget: "idle",
    activeDrawPointerId: null,
  };
}
