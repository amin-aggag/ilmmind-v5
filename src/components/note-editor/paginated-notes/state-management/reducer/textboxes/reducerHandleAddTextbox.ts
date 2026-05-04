import {
  ActionOf,
  CanvasState,
  Notebook,
  Page,
} from "../../CanvasContextTypes";
import { deepCopy } from "../utils/utils";
import { clientToSvgUserPoint } from "../utils/zoom-utils";

export function reducerHandleAddTextbox(
  state: CanvasState,
  action: ActionOf<"ADD_TEXTBOX">,
): CanvasState {
  // Copying the overall state array into another (temporary) array
  const updatedState = state.states.slice(0, state.historyIndex + 1);
  const currentPage =
    updatedState[state.historyIndex][action.payload.pageIndex];

  const newPosition = clientToSvgUserPoint(
    action.payload.svg,
    action.payload.position.left,
    action.payload.position.top,
  );

  // Updating the current page with the new textbox
  const updatedPage: Page = {
    svgData: [...currentPage.svgData],
    textBoxes: [
      ...currentPage.textBoxes,
      {
        textData: undefined,
        position: {
          left: newPosition ? newPosition.x : 0,
          top: newPosition ? newPosition.y : 0,
        },
        size: action.payload.size,
      },
    ],
  };

  // Updating the notebook with the updated page data
  const updatedNotebook: Notebook = deepCopy(updatedState[state.historyIndex]);
  updatedNotebook[action.payload.pageIndex] = updatedPage;

  return {
    ...state,
    states: [...updatedState, updatedNotebook],
    historyIndex: state.historyIndex + 1,
    isTextMode: false,
  };
}
