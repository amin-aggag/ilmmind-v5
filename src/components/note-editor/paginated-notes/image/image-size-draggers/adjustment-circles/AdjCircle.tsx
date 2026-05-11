import React from "react";
import "./adjCircle.css";
import { useAdjCircleDrag } from "./useAjdCircleDrag";

export type AdjCircleCorner =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export function AjdCircle({
  corner,
}: {
  corner: AdjCircleCorner;
}): React.ReactNode {
  const {
    isResizing,
    handleAdjPointerDown,
    handleAdjPointerMove,
    handleAdjPointerUp,
    handleAdjPointerCancel,
  } = useAdjCircleDrag(corner);

  return (
    <div
      className={`${corner} adj-circle ${isResizing && "is-dragging"}`}
      onPointerDown={handleAdjPointerDown}
      onPointerMove={handleAdjPointerMove}
      onPointerUp={handleAdjPointerUp}
      onPointerCancel={handleAdjPointerCancel}
    />
  );
}
