import { useImageAdjustWidth } from "./useImageAdjustWidth";
import "./imageWidthDragger.css";
import React from "react";

export type ImageWidthSide = "left" | "right";

export function ImageWidthDragger({
  side,
}: {
  side: ImageWidthSide;
}): React.ReactElement {
  const {
    isWidthResizing,
    handleWidthPointerDown,
    handleWidthPointerMove,
    handleWidthPointerUp,
    handleWidthPointerCancel,
  } = useImageAdjustWidth(side);

  return (
    <div
      className={`image-width-dragger ${isWidthResizing ? "is-dragging" : ""}`}
      onPointerDown={handleWidthPointerDown}
      onPointerMove={handleWidthPointerMove}
      onPointerUp={handleWidthPointerUp}
      onPointerCancel={handleWidthPointerCancel}
    ></div>
  );
}
