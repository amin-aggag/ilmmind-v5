import { ActionOf, CanvasState, Notebook } from "../../CanvasContextTypes";
import { deepCopy } from "../utils/utils";

export function reducerHandleUpdateTextbox(
  state: CanvasState,
  action: ActionOf<"UPDATE_TEXTBOX">,
) {
  // Copying the overall state array into another (temporary) array
  const updatedState = state.states.slice();

  // Getting the current page and textbox states. Deep copy is needed here so that
  // changes to the textbox in future history frames do not impact the previous
  // history frames due to JavaScript referencing the same memory for two history frames
  // of the same textbox.
  const updatedPage = deepCopy(
    updatedState[state.historyIndex][action.payload.pageIndex],
  );
  const currentTextboxState =
    updatedPage.textBoxes[action.payload.textboxIndex];

  // Updating the current page with the updated textbox data
  updatedPage.textBoxes[action.payload.textboxIndex] = {
    ...currentTextboxState,
    textData: action.payload.newTextBoxData,
  };

  // --- Updating the notebook with the updated page data ---
  const updatedNotebook: Notebook = deepCopy(updatedState[state.historyIndex]);
  updatedNotebook[action.payload.pageIndex] = updatedPage;

  return {
    ...state,
    states: [...state.states, updatedNotebook],
    historyIndex: state.historyIndex + 1,
  };
}
