import React from "react";
import { useCanvasContext } from "../state-management/useCanvasContext";
import { BlockNoteEditor } from "@blocknote/core";

type useTextboxDragArgs = {
  pageIndex: number;
  textboxIndex: number;
  editor: BlockNoteEditor;
};

type useTextboxDragReturn = {
  isDragging: boolean;
  handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleEditorOnChange: () => void;
};

export const useTextboxDrag = ({
  pageIndex,
  textboxIndex,
  editor,
}: useTextboxDragArgs): useTextboxDragReturn => {
  const canvasContext = useCanvasContext();
  const { dispatch } = canvasContext;
  const [isDragging, setIsDragging] = React.useState(false);

  const endDrag = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
    },
    [],
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      dispatch({
        type: "DRAG_TEXTBOX_POINTER_MOVE",
        payload: {
          pageIndex,
          textboxIndex,
          delta: {
            x: e.movementX,
            y: e.movementY,
          },
        },
      });
    },
    [dispatch, isDragging, pageIndex, textboxIndex],
  );

  const handlePointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      dispatch({
        type: "DRAG_TEXTBOX_POINTER_UP",
        payload: {
          pageIndex,
          textboxIndex,
        },
      });

      if (isDragging) {
        endDrag();
      }
    },
    [endDrag, isDragging, dispatch, pageIndex, textboxIndex],
  );

  const handlePointerCancel = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      dispatch({
        type: "DRAG_TEXTBOX_POINTER_UP",
        payload: {
          pageIndex,
          textboxIndex,
        },
      });

      if (isDragging) {
        endDrag();
      }
    },
    [endDrag, isDragging, dispatch, pageIndex, textboxIndex],
  );

  const handleEditorOnChange = React.useCallback(() => {
    dispatch({
      type: "UPDATE_TEXTBOX",
      payload: {
        pageIndex,
        textboxIndex,
        newTextBoxData: editor.document,
      },
    });
  }, [dispatch, editor.document, pageIndex, textboxIndex]);

  React.useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    root.style.cursor = isDragging ? "move" : "";
  }, [isDragging]);

  return {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleEditorOnChange,
  };
};
