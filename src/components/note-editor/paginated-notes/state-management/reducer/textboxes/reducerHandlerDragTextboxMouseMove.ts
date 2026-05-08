import { ActionOf, CanvasState } from "../../CanvasContextTypes";
import { deepCopy } from "../utils/utils";

export function reducerHandleDragTextboxPointerMove(
  state: CanvasState,
  action: ActionOf<"DRAG_TEXTBOX_POINTER_MOVE">,
  pageClickedInfo: DOMRect,
  textboxBeingDraggedInfo: DOMRect,
  svgCanvasesWrapperInfo: DOMRect,
): CanvasState {
  // Copying the overall state array into another (temporary) array
  const updatedState = state.states.slice(0, state.historyIndex + 1);
  const updatedPage = deepCopy(
    updatedState[state.historyIndex][action.payload.pageIndex],
  );
  const currentTextboxState =
    updatedPage.textBoxes[action.payload.textboxIndex];

  // --- Calculating new textbox position ---

  let topPosition = 0;
  let leftPosition = 0;

  if (state.textboxInteractionPosition) {
    topPosition = state.textboxInteractionPosition.top + action.payload.delta.y;
    leftPosition =
      state.textboxInteractionPosition.left + action.payload.delta.x;
  } else {
    topPosition = currentTextboxState.position.top + action.payload.delta.y;
    leftPosition = currentTextboxState.position.left + action.payload.delta.x;
  }

  if (
    topPosition <=
    svgCanvasesWrapperInfo.top - pageClickedInfo.top
    // ||
    // textboxBeingDraggedInfo.bottom <=
    //   svgCanvasesWrapperInfo.bottom - pageClickedInfo.bottom
  ) {
    topPosition -= action.payload.delta.y;
  }

  if (
    leftPosition <=
    svgCanvasesWrapperInfo.left - pageClickedInfo.left
    // ||
    // textboxBeingDraggedInfo.right <
    //   svgCanvasesWrapperInfo.right - pageClickedInfo.right
  ) {
    leftPosition -= action.payload.delta.x;
  }

  return {
    ...state,
    textboxInteractionPosition: {
      top: topPosition,
      left: leftPosition,
    },
  };
}
