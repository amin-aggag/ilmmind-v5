import { CanvasState } from '../CanvasContextTypes';
import React from 'react';

export function useTouchHandlers(
  state: CanvasState,
  dispatch: React.Dispatch<{
    type:
      | 'SET_MOVING_CANVAS'
      | 'SET_TOUCH_START'
      | 'PAN_CANVAS';
    payload: any;
  }>
) {
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      dispatch({
        type: 'SET_MOVING_CANVAS',
        payload: true,
      });
      dispatch({
        type: 'SET_TOUCH_START',
        payload: { x: e.touches[0].pageX, y: e.touches[0].pageY },
      });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 2 || !state.touchStart) return;

    dispatch({
      type: 'SET_MOVING_CANVAS',
      payload: true,
    });

    const deltaX = e.touches[0].pageX - state.touchStart.x;
    const deltaY = e.touches[0].pageY - state.touchStart.y;

    const newLeft = state.position.left + deltaX / 35;
    const newTop = state.position.top + deltaY / 35;

    // Clamp values
    const clampedLeft = Math.max(-100, Math.min(1000, newLeft));
    const clampedTop = Math.max(-100, Math.min(500, newTop));

    dispatch({
      type: 'PAN_CANVAS',
      payload: { left: clampedLeft, top: clampedTop },
    });
  };

  const handleTouchEnd = () => {
    dispatch({
      type: 'SET_MOVING_CANVAS',
      payload: false,
    });
    dispatch({
      type: 'SET_TOUCH_START',
      payload: null,
    });
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}