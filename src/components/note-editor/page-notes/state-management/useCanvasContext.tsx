// hooks/useCanvasContext.tsx
import { createContext, useContext } from 'react';
import { useCanvasReducer } from './useCanvasReducer';
import { usePointerHandlers } from './usePointerHandler';
import { useTouchHandlers } from './useTouchHandlers';
import { CanvasContextValue } from './CanvasContextTypes';

export const CanvasContext = createContext<CanvasContextValue | undefined>(
  undefined
);

export function useCanvasStateVars(): CanvasContextValue {
  const [state, dispatch] = useCanvasReducer();
  const pointerHandlers = usePointerHandlers(state, dispatch);
  const touchHandlers = useTouchHandlers(state, dispatch);

  return {
    state,
    dispatch,
    handlers: {
      pointer: pointerHandlers,
      touch: touchHandlers,
    },
  };
}

export function useCanvasContext(): CanvasContextValue {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error(
      'useCanvasContext must be used within CanvasContext.Provider'
    );
  }
  return context;
}