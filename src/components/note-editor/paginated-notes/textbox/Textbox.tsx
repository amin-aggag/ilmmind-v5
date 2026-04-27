import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Textbox } from "../state-management/CanvasContextTypes";
import "./textbox.css";
import { useCanvasContext } from "../state-management/useCanvasContext";
import { A4_PAGE_72PPI_H } from "../PageNotesEditor";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import React from "react";
import { useTextboxDrag } from "./useTextboxDrag";

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
  const { historyIndex, states } = canvasStateVars.state;
  const textboxInteractionPosition = canvasStateVars.state
    .textboxInteractionPosition as Textbox["position"];
  const { dispatch } = canvasStateVars;
  const {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useTextboxDrag({ pageIndex, textboxIndex });

  const editor = useCreateBlockNote({ initialContent: textboxData.textData }, [
    // This calculation only changes when undoing and redoing (i.e. the users moves
    // through the history array) but not when typing, which prevents the typing experience
    // from feeling jumpy and the focus losing after every 1 or 2 characters typed.
    states.length - 1 - historyIndex,
  ]);

  const handleOnChange = React.useCallback(() => {
    dispatch({
      type: "UPDATE_TEXTBOX",
      payload: {
        pageIndex,
        textboxIndex,
        newTextBoxData: editor.document,
      },
    });
  }, [dispatch, editor.document, pageIndex, textboxIndex]);

  const textboxWrapperDynamicStyle = React.useMemo(
    () => ({
      top: `${
        (isDragging
          ? textboxInteractionPosition.top
          : textboxData.position.top) +
        pageIndex * (A4_PAGE_72PPI_H + 35)
      }px`,
      left: `${isDragging ? textboxInteractionPosition.left : textboxData.position.left}px`,
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
        onChange={handleOnChange}
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
