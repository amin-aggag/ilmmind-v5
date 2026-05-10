import React from "react";
import { useImageAdjustHeight } from "./useImageAdjustHeight";
import './imageHeightDragger.css'

export function ImageHeightDragger(): React.ReactNode {
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
