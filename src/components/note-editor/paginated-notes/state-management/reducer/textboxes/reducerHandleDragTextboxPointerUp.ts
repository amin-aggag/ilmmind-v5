import { ActionOf, CanvasState, Notebook, Textbox } from "../../CanvasContextTypes";
import { deepCopy } from "../utils/utils";

export function reducerHandleDragTextboxPointerUp(
  state: CanvasState,
  action: ActionOf<"DRAG_TEXTBOX_POINTER_UP">,
) {
  // Copying the overall state array into another (temporary) array
  const updatedState = state.states.slice();
  const updatedPage = deepCopy(
    updatedState[state.historyIndex][action.payload.pageIndex],
  );
  const currentTextboxState =
    updatedPage.textBoxes[action.payload.textboxIndex];

  // Updating the current page with the updated textbox data
  const textboxPositionAfterDrag = state.textboxInteractionPosition as Textbox["position"];
  updatedPage.textBoxes[action.payload.textboxIndex] = {
    ...currentTextboxState,
    position: {
      top: textboxPositionAfterDrag.top,
      left: textboxPositionAfterDrag.left,
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
