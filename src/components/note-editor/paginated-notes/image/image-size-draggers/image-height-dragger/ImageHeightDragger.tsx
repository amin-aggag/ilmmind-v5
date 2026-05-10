import React from "react";
import { useImageAdjustHeight } from "./useImageAdjustHeight";
import './imageHeightDragger.css'

type side = "left" | "right";

export function ImageHeightDragger(side: side): React.ReactNode {
  const {
    isHeightResizing,
    handleHeightPointerDown,
    handleHeightPointerMove,
    handleHeightPointerUp,
    handleHeightPointerCancel,
  } = useImageAdjustHeight();

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
