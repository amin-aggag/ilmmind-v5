import React from "react";

// --- Types ---

export type ImageContextValue = {
  height: number;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  width: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
};

const DEFAULT_IMAGE_WIDTH_PX = 1280 / 3;
const DEFAULT_IMAGE_HEIGHT_PX = 853 / 3;

// --- Context functions ---

export const ImageContext = React.createContext<ImageContextValue | undefined>(
  undefined,
);

export function useImageStateVars(): ImageContextValue {
  const [width, setWidth] = React.useState<number>(DEFAULT_IMAGE_WIDTH_PX);
  const [height, setHeight] = React.useState<number>(DEFAULT_IMAGE_HEIGHT_PX);

  return {
    width,
    setWidth,
    height,
    setHeight,
  };
}

export function useImageContext(): ImageContextValue {
  const context = React.useContext(ImageContext);
  if (!context) {
    throw new Error(
      "useImageContext must be used within ImageContext.Provider",
    );
  }
  return context;
}
