import { CanvasState } from '../CanvasContextTypes';
import React from 'react';

export function usePointerHandlers(
  state: CanvasState,
  dispatch: React.Dispatch<{
    type: 'POINTER_DOWN' | 'POINTER_MOVE' | 'POINTER_UP';
    payload: any;
  }>
) {
  const handlePointerDown = (e: PointerEvent, activePageIndex: number) => {
    const target = e.target as SVGSVGElement;
    target.setPointerCapture(e.pointerId);

    const points: [number, number, number][] = [
      [
        e.pageX - (e.target as SVGSVGElement).getBoundingClientRect().left,
        e.pageY - (e.target as SVGSVGElement).getBoundingClientRect().top,
        e.pressure,
      ],
    ];

    // console.log("handlePointerDown: e.buttons = ", e.buttons);

    dispatch({
      type: "POINTER_DOWN",
      payload: { points, activePageIndex },
    });
  };

  const handlePointerMove = (e: PointerEvent, activePageIndex: number) => {
    if (
      e.pointerType === "pen" ||
      e.pointerType === "mouse" ||
      e.pointerType === "touch"
    ) {
      // console.log("handlePointerMove: e.buttons = ", e.buttons);
      if (e.buttons !== 1) return;

      const newPoints: [number, number, number][] = [
        ...state.points,
        [
          e.pageX - (e.target as SVGSVGElement).getBoundingClientRect().left,
          e.pageY - (e.target as SVGSVGElement).getBoundingClientRect().top,
          e.pressure,
        ],
      ];

      dispatch({
        type: "POINTER_MOVE",
        payload: { points: newPoints, activePageIndex },
      });
    }
  };

  const handlePointerUp = (
    e: PointerEvent,
    pathData: string,
    activePageIndex: number,
  ) => {
    if (
      e.pointerType === "pen" ||
      e.pointerType === "mouse" ||
      e.pointerType === "touch"
    ) {
      dispatch({
        type: "POINTER_UP",
        payload: { pathData, activePageIndex },
      });

      // console.log("handlePointerUp: e.buttons = ", e.buttons);
    }
  };

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}