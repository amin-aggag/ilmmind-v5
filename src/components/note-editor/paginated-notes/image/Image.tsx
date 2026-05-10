import React from "react";
import imgUrl from "./masjid-nabawi.jpg";
import "./image.css";
import { useImageAdjustWidth } from "./useImageAdjustWidth";
import { useImageAdjustHeight } from "./useImageAdjustHeight";

export function Image(): React.ReactNode {
    const imageDraggerRef = React.useRef<HTMLDivElement>(null);

  const {
    isWidthResizing,
    width,
    handleWidthPointerDown,
    handleWidthPointerMove,
    handleWidthPointerUp,
    handleWidthPointerCancel,
  } = useImageAdjustWidth();

  const {
    isHeightResizing,
    height,
    handleHeightPointerDown,
    handleHeightPointerMove,
    handleHeightPointerUp,
    handleHeightPointerCancel,
  } = useImageAdjustHeight();

  const isResizing = isWidthResizing || isHeightResizing;

  return (
    <div className="image">
      <img className="image-content" src={imgUrl} width={`${width}px`} height={`${height}px`} />
      <div
        className={`image-width-dragger ${isResizing ? "is-dragging" : ""}`}
        onPointerDown={handleWidthPointerDown}
        onPointerMove={handleWidthPointerMove}
        onPointerUp={handleWidthPointerUp}
        onPointerCancel={handleWidthPointerCancel}
        ref={imageDraggerRef}
      ></div>
      <div
        className={`image-height-dragger ${isResizing ? "is-dragging" : ""}`}
        onPointerDown={handleHeightPointerDown}
        onPointerMove={handleHeightPointerMove}
        onPointerUp={handleHeightPointerUp}
        onPointerCancel={handleHeightPointerCancel}
        ref={imageDraggerRef}
      ></div>
    </div>
  );
}
