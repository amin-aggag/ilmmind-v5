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
  const editor = useCreateBlockNote({ initialContent: textboxData.textData });

  const canvasStateVars = useCanvasContext();
  const { position } = canvasStateVars.state;
  const { dispatch } = canvasStateVars;

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
          textboxData.position.top -
          position.top +
          pageIndex * (A4_PAGE_72PPI_H + 35),
        left: textboxData.position.left - position.left,
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
