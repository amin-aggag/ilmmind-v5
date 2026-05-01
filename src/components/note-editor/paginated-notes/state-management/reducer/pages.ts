import { CanvasState } from "../CanvasContextTypes";

export function reducerHandleAddPage(state: CanvasState) {
  const updatedState = state.states.slice(0, state.historyIndex + 1);
  const updated_notebook = updatedState[state.historyIndex].slice();
  updated_notebook.push({
    svgData: [],
    textBoxes: [],
  });

  return {
    ...state,
    states: [...updatedState, updated_notebook],
    historyIndex: state.historyIndex + 1,
  };
}
