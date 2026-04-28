import { useRef } from "react";
import { useCanvasContext } from "../state-management/useCanvasContext";
import {
  FilePlusIcon,
  ListPlusIcon,
  PenIcon,
  RedoIcon,
  TextIcon,
  UndoIcon,
} from "lucide-react";
import "./UI.css";

import { EditorUIButton } from "./EditorButton";
import { Separator } from "./Separator";
import DropdownMenuDemo from "./dropdown-menu/dropdownMenu";
import { Textbox } from "../state-management/CanvasContextTypes";

const colorArray = [
  "black",
  "orange",
  "mediumseagreen",
  "tomato",
  "violet",
  "dodgerblue",
  "slateblue",
  "lightgray",
] as const;

const penSizeArray = [1, 2, 4, 6, 8, 10, 20, 30] as const;

export default function UI() {
  const { state, dispatch } = useCanvasContext();

  const { states, historyIndex, pen, isTextMode } = state;
  const { color, size } = pen;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleUndo = () => {
    dispatch({ type: "UNDO" });
  };

  const handleRedo = () => {
    dispatch({ type: "REDO" });
  };

  const handlePenSizeChange = (newSize: number) => {
    dispatch({
      type: "SET_PEN_SIZE",
      payload: newSize,
    });
  };

  const handleSetTextMode = (isTextMode: boolean) => {
    dispatch({
      type: "SET_TEXT_MODE",
      payload: {
        isTextMode,
      },
    });
  };

  const handleSetColour = (colour: string) => {
    dispatch({
      type: "SET_PEN_COLOR",
      payload: colour,
    });
  };

  const isUndoDisabled = states.length === 1 || historyIndex <= 0;
  const isRedoDisabled =
    (states.length === 1 && historyIndex <= 0) ||
    historyIndex === states.length - 1;

  return (
    <div className="paginated-notes-toolbar">
      <EditorUIButton
        onClick={handleUndo}
        selected={true}
        isDisabled={isUndoDisabled}
      >
        <UndoIcon />
      </EditorUIButton>
      <EditorUIButton
        onClick={handleRedo}
        selected={true}
        isDisabled={isRedoDisabled}
      >
        <RedoIcon />
      </EditorUIButton>
      <Separator />

      {/* Pen and text mode toggles */}
      <EditorUIButton
        onClick={() => {
          handleSetTextMode(false);
        }}
        selected={isTextMode == false}
      >
        <PenIcon />
      </EditorUIButton>
      <EditorUIButton
        onClick={(e: PointerEvent) => {
          handleSetTextMode(!isTextMode);
        }}
        selected={isTextMode}
      >
        <ListPlusIcon />
      </EditorUIButton>
      <Separator />

      {/* Pen Colour */}
      {colorArray.map((penColor, index) => (
        <EditorUIButton
          onClick={() => {
            handleSetTextMode(false);
            handleSetColour(penColor);
          }}
          selected={penColor === color}
          key={index}
        >
          <div
            className={`colour-icon`}
            style={{ backgroundColor: penColor }}
          ></div>
        </EditorUIButton>
      ))}
      <Separator />

      {/* New Page */}
      <EditorUIButton
        onClick={() => {
          dispatch({
            type: "ADD_PAGE",
          });
        }}
        selected={true}
      >
        <FilePlusIcon className="add-page" size={"25px"} />
      </EditorUIButton>

      <Separator />

      <DropdownMenuDemo />
    </div>
  );
}
