import React from "react";
import { useCanvasContext } from "../state-management/useCanvasContext";
import { ImageContextValue } from "./useImageContext";

type useImageDragReturn = {
  handleImageDragPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleImageDragPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleImageDragPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleImageDragPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export const useImageDrag = (
  imageContextValue: ImageContextValue,
  imageRef: React.RefObject<HTMLImageElement | null>,
): useImageDragReturn => {
  const [isMoving, setIsMoving] = React.useState<boolean>(false);

  const { state: CanvasState } = useCanvasContext();
  const zoomLevel: number = CanvasState.scalingValues.startScale;
  const { setTop, setLeft, setIsSelected, isSelected } = imageContextValue;
  const pointerWasMoved = React.useRef<boolean>(false);

  const handleImageDragPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      e.currentTarget.setPointerCapture(e.pointerId);
      console.log("pointerDown ran");
      setIsMoving(true);
    },
    [],
  );

  const handleImageDragPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isMoving) return;
      if (!isSelected) return;

      pointerWasMoved.current = true;

      setLeft((prev) => prev + e.movementX / zoomLevel);
      setTop((prev) => prev + e.movementY / zoomLevel);

      console.log("pointerMove ran");
    },
    [setLeft, setTop, zoomLevel, isSelected, isMoving],
  );

  const handleImageDragPointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      setIsMoving((prev) => !prev);

      if (!pointerWasMoved.current) setIsSelected((prev) => !prev);
      pointerWasMoved.current = false;

      console.log("pointerUp ran");
    },
    [pointerWasMoved, setIsSelected],
  );

  const handleImageDragPointerCancel = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      setIsMoving((prev) => !prev);

      if (!pointerWasMoved.current) setIsSelected((prev) => !prev);
      pointerWasMoved.current = false;

      console.log("pointerCancel ran");
    },
    [pointerWasMoved, setIsSelected],
  );

  React.useEffect(() => {
    if (imageRef.current === null) return;

    // The functionality in this useLayoutEffect attempts to make sure that the
    // 'move' cursor property is only set when 1) the user clicks and holds on the
    // image for 100ms or more, or 2) when the user is actually moving the image.
    // When selecting or deselecting the image, this cursor should never come up.

    // When deselecting the image:
    if (imageRef.current.classList.contains("selected")) {
      setTimeout(() => {
        if (imageRef.current === null) return;

        if (imageRef.current.classList.contains("selected") && isMoving) {
          imageRef.current.style.cursor = "move";
        } else {
          imageRef.current.style.cursor = "";
        }
      }, 60);
    } else {
      // When selecting the image:
      imageRef.current.style.cursor = "";
    }
  }, [isMoving, isSelected, imageRef]);

  return {
    handleImageDragPointerDown,
    handleImageDragPointerMove,
    handleImageDragPointerUp,
    handleImageDragPointerCancel,
  };
};
