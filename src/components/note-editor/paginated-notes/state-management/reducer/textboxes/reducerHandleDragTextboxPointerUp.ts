import {
  ActionOf,
  CanvasState,
  Notebook,
  Textbox,
} from "../../CanvasContextTypes";
import { deepCopy } from "../utils/utils";

export function reducerHandleDragTextboxPointerUp(
  state: CanvasState,
  action: ActionOf<"DRAG_TEXTBOX_POINTER_UP">,
): CanvasState {
  /* Note to self - Add this to the not-in-code documentation for the app once the
  // first version of the app is complete:
  //
  // Previously, updatedState used to just be state.states.slice() and
  // [...state.states, updatedNotebook] was returned, but this had a problem:
  // the new changes were always appended at the very front of the states array.
  // This means that undoing and then making a change to the note did not
  // overwrite the undone history frames, which is a huge bug and not what is meant
  // to happen. Hence the add (0, state.historyIndex + 1) in the .slice method call.
  //
  **/
  // Copying the overall state array into another (temporary) array
  const updatedState = state.states.slice(0, state.historyIndex + 1);
  const updatedPage = deepCopy(
    updatedState[state.historyIndex][action.payload.pageIndex],
  );
  const currentTextboxState =
    updatedPage.textBoxes[action.payload.textboxIndex];

  // Updating the current page with the updated textbox data
  const textboxPositionAfterDrag =
    state.textboxInteractionPosition as Textbox["position"];
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
    states: [...updatedState, updatedNotebook],
    historyIndex: state.historyIndex + 1,
    textboxInteractionPosition: null,
  };
}
