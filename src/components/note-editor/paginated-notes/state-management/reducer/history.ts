import { CanvasState } from "../CanvasContextTypes";

export function reducerHandleUndo(
    state: CanvasState
  ) {
    if (
        state.historyIndex > 0 &&
        state.historyIndex <= state.states.length - 1
      ) {
        return {
          ...state,
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;
  }

  export function reducerHandleRedo(
    state: CanvasState
  ) {
    if (
        state.historyIndex > -1 &&
        state.historyIndex < state.states.length - 1
      ) {
        return {
          ...state,
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;
  }


  