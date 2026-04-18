// hooks/usePointerHandlers.ts
import { CanvasState } from './CanvasContextTypes';
import React from 'react';

export function usePointerHandlers(
  state: CanvasState,
  dispatch: React.Dispatch<{
    type: 'POINTER_DOWN' | 'POINTER_MOVE' | 'POINTER_UP';
    payload: any;
  }>
) {
  const handlePointerDown = (e: PointerEvent) => {
    const target = e.currentTarget as SVGSVGElement;
    target.setPointerCapture(e.pointerId);

    const points: [number, number, number][] = [
      [
        e.pageX - state.position.left,
        e.pageY - state.position.top,
        e.pressure,
      ],
    ];

    dispatch({
      type: 'POINTER_DOWN',
      payload: { points },
    });
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (
      e.pointerType === 'pen' ||
      e.pointerType === 'mouse' ||
      e.pointerType === 'touch'
    ) {
      if (e.buttons !== 1) return;

      const newPoints: [number, number, number][] = [
        ...state.points,
        [
          e.pageX - state.position.left,
          e.pageY - state.position.top,
          e.pressure,
        ],
      ];

      dispatch({
        type: 'POINTER_MOVE',
        payload: { points: newPoints },
      });
    }
  };

  const handlePointerUp = (e: PointerEvent, pathData: string) => {
    if (
      e.pointerType === 'pen' ||
      e.pointerType === 'mouse' ||
      e.pointerType === 'touch'
    ) {
      dispatch({
        type: 'POINTER_UP',
        payload: { pathData },
      });
    }
  };

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}