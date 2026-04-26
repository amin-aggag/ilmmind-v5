import { ActionOf, CanvasState, Notebook } from "../../CanvasContextTypes";
import { deepCopy } from "../utils/utils";

export function reducerHandlerDragTextboxPointerMove(
  state: CanvasState,
  action: ActionOf<"DRAG_TEXTBOX_POINTER_MOVE">,
) {
  // --- Getting the position info of this page ---
  const pageClicked = document.querySelector(
    `.svg-canvas[data-page-index="${action.payload.pageIndex}"]`,
  ) as Element;
  const pageClickedInfo = pageClicked.getBoundingClientRect();

  // --- Getting the position info of the textbox ---
  const textboxBeingDragged = document.querySelector(
    `.textbox-wrapper[data-textbox-index="${action.payload.textboxIndex}"]`,
  ) as Element;
  const textboxBeingDraggedInfo = textboxBeingDragged.getBoundingClientRect();
  // const textboxBorderWidth = Number(
  //   getComputedStyle(textboxBeingDragged)
  //     .getPropertyValue("--textbox-border-width")
  //     .slice(0, -2),
  // );

  // // --- Getting the position info of the textbox drag handle ---
  // const textboxDragHandlebarWidth = Number(
  //   getComputedStyle(textboxBeingDragged)
  //     .getPropertyValue("--textbox-drag-handlebar-width")
  //     .slice(0, -2),
  // );

  // --- Getting top position of svg-canvases-wrapper ---
  const svgCanvasesWrapper = document.getElementById(
    "svg-canvases-wrapper",
  ) as Element;
  const svgCanvasesWrapperInfo = svgCanvasesWrapper.getBoundingClientRect();

  // Copying the overall state array into another (temporary) array
  const updatedState = state.states.slice();
  const updatedPage = deepCopy(
    updatedState[state.historyIndex][action.payload.pageIndex],
  );
  const currentTextboxState =
    updatedPage.textBoxes[action.payload.textboxIndex];

  // --- Calculating new textbox position ---

  let topPosition = currentTextboxState.position.top + action.payload.delta.y;
  let leftPosition = currentTextboxState.position.left + action.payload.delta.x;

  if (
    topPosition <= svgCanvasesWrapperInfo.top - pageClickedInfo.top ||
    textboxBeingDraggedInfo.bottom <=
      svgCanvasesWrapperInfo.bottom - pageClickedInfo.bottom
  ) {
    topPosition -= action.payload.delta.y;
  }

  if (
    leftPosition <= svgCanvasesWrapperInfo.left - pageClickedInfo.left ||
    textboxBeingDraggedInfo.right <
      svgCanvasesWrapperInfo.right - pageClickedInfo.right
  ) {
    leftPosition -= action.payload.delta.x;
  }

  // Updating the current page with the updated textbox data
  updatedPage.textBoxes[action.payload.textboxIndex] = {
    ...currentTextboxState,
    position: {
      top: topPosition,
      left: leftPosition,
    },
  };

  // Updating the notebook with the updated page data
  const updatedNotebook: Notebook = deepCopy(updatedState[state.historyIndex]);
  updatedNotebook[action.payload.pageIndex] = updatedPage;

  return {
    ...state,
    states: [...state.states, updatedNotebook],
    historyIndex: state.historyIndex + 1,
  };
}
