import React from "react";
import { useImageAdjustWidth } from "./useImageAdjustWidth";
import './imageWidthDragger.css'

export function ImageWidthDragger(): React.ReactNode {
  const {
    isWidthResizing,
    handleWidthPointerDown,
    handleWidthPointerMove,
    handleWidthPointerUp,
    handleWidthPointerCancel,
  } = useImageAdjustWidth();

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
