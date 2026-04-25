import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Textbox } from "../state-management/CanvasContextTypes";
import "./textbox.css";
import { useCanvasContext } from "../state-management/useCanvasContext";
import { A4_PAGE_72PPI_H } from "../PageNotesEditor";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import React, { PointerEventHandler } from "react";

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
  const { dispatch } = canvasStateVars;

  const [isDraggingTextbox, setIsDraggingTextbox] =
    React.useState<boolean>(false);
  const textboxMenuHandlebar = React.useRef<HTMLDivElement>(null);

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
  }, []);

  const handleDragTextboxMouseDown = React.useCallback(() => {
    setIsDraggingTextbox(true);
  }, []);

  const handleDragTextboxMouseMove = React.useCallback((e: PointerEvent) => {
    if (e.buttons === 1) {
      dispatch({
        type: "DRAG_TEXTBOX_MOUSE_MOVE",
        payload: {
          pageIndex,
          textboxIndex,
          delta: {
            x: e.movementX,
            y: e.movementY,
          },
        },
      });
    }
  }, []);

  const handleDragTextboxMouseUp = React.useCallback(() => {
    setIsDraggingTextbox(false);
  }, []);

  // --- Dragging functionality code ---
  React.useEffect(() => {
    if (isDraggingTextbox) {
      document.getElementById("root")!.style.cursor = "move";

      document.addEventListener("pointerdown", handleDragTextboxMouseDown);
      document.addEventListener("pointermove", handleDragTextboxMouseMove);
      document.addEventListener("pointerup", handleDragTextboxMouseUp);

      return () => {
        document.removeEventListener(
          "pointermove",
          handleDragTextboxMouseMove as (event: PointerEvent) => void,
        );
        document.removeEventListener("pointerup", handleDragTextboxMouseUp);
      };
    } else {
      document.getElementById("root")!.style.cursor = "";
    }
  }, [isDraggingTextbox]);

  const textboxWrapperDynamicStyle = React.useMemo(() => ({
    top: `${
      textboxData.position.top + pageIndex * (A4_PAGE_72PPI_H + 35)
    }px`,
    left: `${textboxData.position.left}px`,
  }), [textboxData.position, pageIndex]);

  return (
    <div
      className="textbox-wrapper"
      style={textboxWrapperDynamicStyle}
    >
      <BlockNoteView
        editor={editor}
        theme={"light"}
        onChange={handleOnChange}
        className="textbox-content"
      />
      <div
        className={`textbox-menu-handlebar ${isDraggingTextbox ? "is-dragging" : ""}`}
        ref={textboxMenuHandlebar}
      >
        <DragHandleDots2Icon />
      </div>
    </div>
  );
};
