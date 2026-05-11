import React from "react";

// --- Types ---

export type ImageContextValue = {
  height: number;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  width: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  top: number;
  setTop: React.Dispatch<React.SetStateAction<number>>;
  left: number;
  setLeft: React.Dispatch<React.SetStateAction<number>>;
  isSelected: boolean;
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [top, setTop] = React.useState<number>(25);
  const [left, setLeft] = React.useState<number>(25);
  const [isSelected, setIsSelected] = React.useState<boolean>(false);

  return {
    width,
    setWidth,
    height,
    setHeight,
    top,
    setTop,
    left,
    setLeft,
    isSelected,
    setIsSelected,
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
