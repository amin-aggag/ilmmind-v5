import {
  ActionOf,
  CanvasState,
  Notebook,
  Page,
} from "../../CanvasContextTypes";
import { deepCopy, toPageRelativePosition } from "../utils/utils";

export function reducerHandleAddTextbox(
  state: CanvasState,
  action: ActionOf<"ADD_TEXTBOX">,
) {
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
        position: toPageRelativePosition(
          action.payload.position,
          pageClickedInfo,
        ),
        size: action.payload.size,
      },
    ],
  };

  // Updating the notebook with the updated page data
  const updatedNotebook: Notebook = deepCopy(updatedState[state.historyIndex]);
  updatedNotebook[action.payload.pageIndex] = updatedPage;

  return {
    ...state,
    states: [...state.states, updatedNotebook],
    historyIndex: state.historyIndex + 1,
    isTextMode: false,
  };
}
