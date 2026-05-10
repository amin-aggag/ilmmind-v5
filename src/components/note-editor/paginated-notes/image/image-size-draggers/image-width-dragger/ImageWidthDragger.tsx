import React from "react";
import { useImageAdjustWidth } from "./useImageAdjustWidth";
import './imageWidthDragger.css'

type side = "top" | "bottom";

export function ImageWidthDragger(side: side): React.ReactNode {
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
