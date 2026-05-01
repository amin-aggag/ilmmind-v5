import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { CanvasState, Textbox } from "../state-management/CanvasContextTypes";
import "./textbox.css";
import { useCanvasContext } from "../state-management/useCanvasContext";
import { A4_PAGE_72PPI_H } from "../Page";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import React from "react";
import { useTextboxDrag } from "./useTextboxDrag";

const findUserHasUndoneOrRedone = (canvasState: CanvasState) => {
  const { states, historyIndex } = canvasState;

  const userHasUndoneOrRedone = states.length - 1 - historyIndex;

  return userHasUndoneOrRedone;
};

export const TextboxComponent = ({
  pageIndex,
  textboxIndex,
  textboxData,
}: {
  pageIndex: number;
  textboxIndex: number;
  textboxData: Textbox;
}) => {
  const canvasStateVars = useCanvasContext();
  const textboxInteractionPosition =
    canvasStateVars.state.textboxInteractionPosition;

  const userHasUndoneOrRedone = findUserHasUndoneOrRedone(
    canvasStateVars.state,
  );

  const editor = useCreateBlockNote({ initialContent: textboxData.textData }, [
    userHasUndoneOrRedone,
  ]);

  const {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleEditorOnChange,
  } = useTextboxDrag({ pageIndex, textboxIndex, editor });

  const textboxWrapperDynamicStyle = React.useMemo(
    () => ({
      top: `${
        (isDragging && textboxInteractionPosition
          ? textboxInteractionPosition.top
          : textboxData.position.top) +
        pageIndex * (A4_PAGE_72PPI_H + 35)
      }px`,
      left: `${isDragging && textboxInteractionPosition ? textboxInteractionPosition.left : textboxData.position.left}px`,
    }),
    [textboxData.position, pageIndex, isDragging, textboxInteractionPosition],
  );

  return (
    <div
      className="textbox-wrapper"
      style={textboxWrapperDynamicStyle}
      data-textbox-index={`${textboxIndex}`}
    >
      <BlockNoteView
        editor={editor}
        theme={"light"}
        onChange={handleEditorOnChange}
        className="textbox-content"
      />
      <div
        className={`textbox-drag-handlebar ${isDragging ? "is-dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        data-textbox-index={`${textboxIndex}`}
      >
        <DragHandleDots2Icon />
      </div>
    </div>
  );
};
