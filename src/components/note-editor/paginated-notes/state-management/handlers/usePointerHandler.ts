import { ActionOf, CanvasState } from "../CanvasContextTypes";
import { clientToSvgUserPoint } from "../reducer/utils/utils";
import React from "react";

type POINTER_EVENTS = "POINTER_DOWN" | "POINTER_MOVE" | "POINTER_UP";

function svgCoordsFromPointerEvent(e: PointerEvent): [number, number] | null {
  const svg = (e.target as Element | null)?.closest(
    ".svg-canvas",
  ) as SVGSVGElement | null;
  if (!svg) return null;
  const p = clientToSvgUserPoint(svg, e.clientX, e.clientY);
  if (!p) return null;
  return [p.x, p.y];
}

type usePointerHandlersReturn = {
  handlePointerDown: (e: PointerEvent, activePageIndex: number) => void;
  handlePointerMove: (e: PointerEvent, activePageIndex: number) => void;
  handlePointerUp: (
    e: PointerEvent,
    pathData: string,
    activePageIndex: number,
  ) => void;
};

export function usePointerHandlers(
  state: CanvasState,
  dispatch: React.Dispatch<ActionOf<POINTER_EVENTS>>,
): usePointerHandlersReturn {
  const handlePointerDown = (
    e: PointerEvent,
    activePageIndex: number,
  ): void => {
    const svg = (e.target as Element | null)?.closest(
      ".svg-canvas",
    ) as SVGSVGElement | null;
    if (!svg) return;
    svg.setPointerCapture(e.pointerId);

    const xy = svgCoordsFromPointerEvent(e);
    if (!xy) return;

    const points: [number, number, number][] = [[xy[0], xy[1], e.pressure]];

    dispatch({
      type: "POINTER_DOWN",
      payload: { points, activePageIndex },
    });
  };

  const handlePointerMove = (
    e: PointerEvent,
    activePageIndex: number,
  ): void => {
    if (
      e.pointerType === "pen" ||
      e.pointerType === "mouse" ||
      e.pointerType === "touch"
    ) {
      // console.log("handlePointerMove: e.buttons = ", e.buttons);
      if (e.buttons !== 1) return;

      const xy = svgCoordsFromPointerEvent(e);
      if (!xy) return;

      const newPoints: [number, number, number][] = [
        ...state.points,
        [xy[0], xy[1], e.pressure],
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
  ): void => {
    if (
      e.pointerType === "pen" ||
      e.pointerType === "mouse" ||
      e.pointerType === "touch"
    ) {
      dispatch({
        type: "POINTER_UP",
        payload: { pathData, activePageIndex },
      });
    }
  };

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
