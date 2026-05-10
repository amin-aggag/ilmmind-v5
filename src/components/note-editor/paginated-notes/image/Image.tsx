import React from "react";
import imgUrl from "./masjid-nabawi.jpg";
import "./image.css";
import { ImageContext, useImageStateVars } from "./useImageContext";
import { ImageWidthDragger } from "./image-size-draggers/image-width-dragger/ImageWidthDragger";
import { ImageHeightDragger } from "./image-size-draggers/image-height-dragger/ImageHeightDragger";

export function Image(): React.ReactNode {
  const imageContextValue = useImageStateVars();

  return (
    <ImageContext.Provider value={imageContextValue}>
      <div className="image">
        {/* Row 1 */}
        <>
          <div className="top-left adj-circle" />
          <ImageHeightDragger side={""} />
          <div className="top-right adj-circle" />
        </>
        {/* Row 2 */}
        <>
          <ImageWidthDragger />
          <img
            className="image-content"
            src={imgUrl}
            width={`${imageContextValue.width}px`}
            height={`${imageContextValue.height}px`}
          />
          <ImageWidthDragger />
        </>
        {/* Row 3 */}
        <>
          <div className="bottom-left adj-circle" />
          <ImageHeightDragger />
          <div className="bottom-right adj-circle" />
        </>
      </div>
    </ImageContext.Provider>
  );
}
