import { CanvasState } from "../CanvasContextTypes";

export function reducerHandleAddPage(state: CanvasState) {
  const updated_notebook = state.states[state.historyIndex].slice();
  updated_notebook.push({
    svgData: [],
    textBoxes: [],
  });

  return {
    ...state,
    states: [...state.states, updated_notebook],
    historyIndex: state.historyIndex + 1,
  };
}
