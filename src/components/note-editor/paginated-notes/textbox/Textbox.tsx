import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Textbox } from "../state-management/CanvasContextTypes";
import "./textbox.css";
import { useCanvasContext } from "../state-management/useCanvasContext";
import { A4_PAGE_72PPI_H } from "../PageNotesEditor";

export const TextboxComponent = ({
  pageIndex,
  textboxIndex,
  textboxData,
}: {
  pageIndex: number;
  textboxIndex: number;
  textboxData: Textbox;
}) => {
  // Do I want to have the textbox get the textbox data itself from the context using
  // the pageIndex, or do I pass it the textbox data from the SVGCanvas so it doesn't
  // have to fetch it itself? I have to check the React 'Thinking in React' docs page
  // to help me make this decision, I don't know which one is better. Cursor's AI
  // said that just getting from the parent is better since if the parent re-renders,
  // then this component also re-renders and gets the new textbox data without having
  // to fetch it itself again, but I'll figure out this concretely later.

  const canvasStateVars = useCanvasContext();
  const { position, historyIndex, states } = canvasStateVars.state;
  const { dispatch } = canvasStateVars;

  const editor = useCreateBlockNote({ initialContent: textboxData.textData }, [
    // This calculation only changes when undoing and redoing but not when typing,
    // which prevents the typing experience from feeling jumpy and the focus losing
    // after every 1 or 2 characters typed.
    states.length - 1 - historyIndex,
  ]);

  const handleOnChange = () => {
    dispatch({
      type: "UPDATE_TEXTBOX",
      payload: {
        pageIndex,
        textboxIndex,
        newTextBoxData: editor.document,
      },
    });
  };

  return (
    <div
      className="textbox-wrapper"
      style={{
        top:
          `${textboxData.position.top +
          pageIndex * (A4_PAGE_72PPI_H + 35)}px`,
        left: `${textboxData.position.left}px`,
      }}
    >
      <BlockNoteView
        editor={editor}
        theme={"light"}
        onChange={handleOnChange}
      />
    </div>
  );
};
