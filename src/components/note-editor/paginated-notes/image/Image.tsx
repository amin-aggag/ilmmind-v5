import React from "react";
import imgUrl from "./ilmmind-preview-image-v2.png";
import "./image.css";
import { ImageContext, useImageStateVars } from "./useImageContext";
import { ImageWidthDragger } from "./image-size-draggers/image-width-dragger/ImageWidthDragger";
import { ImageHeightDragger } from "./image-size-draggers/image-height-dragger/ImageHeightDragger";
import { useImageDrag } from "./useImageDrag";
import { AjdCircle } from "./image-size-draggers/adjustment-circles/AdjCircle";

export function Image(): React.ReactNode {
  const imageContextValue = useImageStateVars();

  const {
    handleImageDragPointerDown,
    handleImageDragPointerMove,
    handleImageDragPointerUp,
    handleImageDragPointerCancel,
  } = useImageDrag(imageContextValue);

  return (
    <ImageContext.Provider value={imageContextValue}>
      <div
        className="image"
        style={{
          top: `${imageContextValue.top}px`,
          left: `${imageContextValue.left}px`,
        }}
        onPointerDown={handleImageDragPointerDown}
        onPointerMove={handleImageDragPointerMove}
        onPointerUp={handleImageDragPointerUp}
        onPointerCancel={handleImageDragPointerCancel}
      >
        {/* Row 1 */}
        <>
          <AjdCircle corner="top-left" />
          <ImageHeightDragger side="top" />
          <AjdCircle corner="top-right" />
        </>
        {/* Row 2 */}
        <>
          <ImageWidthDragger side="left" />
          <img
            className="image-content"
            src={imgUrl}
            width={`${imageContextValue.width}px`}
            height={`${imageContextValue.height}px`}
          />
          <ImageWidthDragger side="right" />
        </>
        {/* Row 3 */}
        <>
          <AjdCircle corner="bottom-left" />
          <ImageHeightDragger side="bottom" />
          <AjdCircle corner="bottom-right" />
        </>
      </div>
    </ImageContext.Provider>
  );
}
