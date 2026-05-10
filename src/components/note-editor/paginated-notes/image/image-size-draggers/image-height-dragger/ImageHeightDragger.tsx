import React from "react";
import { useImageAdjustHeight } from "./useImageAdjustHeight";
import "./imageHeightDragger.css";

export type ImageHeightSide = "top" | "bottom";

export function ImageHeightDragger({
  side,
}: {
  side: ImageHeightSide;
}): React.ReactNode {
  const {
    isHeightResizing,
    handleHeightPointerDown,
    handleHeightPointerMove,
    handleHeightPointerUp,
    handleHeightPointerCancel,
  } = useImageAdjustHeight(side);

  return (
    <div
      className={`image-height-dragger ${isHeightResizing ? "is-dragging" : ""}`}
      onPointerDown={handleHeightPointerDown}
      onPointerMove={handleHeightPointerMove}
      onPointerUp={handleHeightPointerUp}
      onPointerCancel={handleHeightPointerCancel}
    ></div>
  );
}
