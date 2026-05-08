import React from "react";
import { useCanvasContext } from "../state-management/useCanvasContext";
import {
  FilePlusIcon,
  ListPlusIcon,
  PenIcon,
  RedoIcon,
  UndoIcon,
} from "lucide-react";
import "./UI.css";

import { EditorUIButton } from "./EditorButton";
import { Separator } from "./Separator";

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

// const penSizeArray= [1, 2, 4, 6, 8, 10, 20, 30] as const;

export default function UI(): React.ReactNode {
  const { state, dispatch } = useCanvasContext();

  const { states, historyIndex, pen, isTextMode } = state;
  const { color, size } = pen;

  const [penColourPickerOpen, setPenColourPickerOpen] =
    React.useState<boolean>(false);
  const [penSizePickerOpen, setPenSizePickerOpen] =
    React.useState<boolean>(false);

  // const inputRef = useRef<HTMLInputElement>(null);

  const handleUndo = (): void => {
    dispatch({ type: "UNDO" });
  };

  const handleRedo = (): void => {
    dispatch({ type: "REDO" });
  };

  // const handlePenSizeChange = (newSize: number): void => {
  //   dispatch({
  //     type: "SET_PEN_SIZE",
  //     payload: newSize,
  //   });
  // };

  const handleSetTextMode = (isTextMode: boolean): void => {
    dispatch({
      type: "SET_TEXT_MODE",
      payload: {
        isTextMode,
      },
    });
  };

  const handleSetColour = (colour: string): void => {
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
      <EditorUIButton onClick={handleUndo} isDisabled={isUndoDisabled}>
        <UndoIcon />
      </EditorUIButton>
      <EditorUIButton onClick={handleRedo} isDisabled={isRedoDisabled}>
        <RedoIcon />
      </EditorUIButton>

      <Separator />

      {/* Pen colour toolbar */}
      <EditorUIButton
        onClick={() => {
          handleSetTextMode(false);
        }}
        selected={isTextMode == false}
      >
        <PenIcon />
      </EditorUIButton>

      <EditorUIButton
        onClick={() => {
          setPenSizePickerOpen(false);
          setPenColourPickerOpen((prev) => !prev);
        }}
        selected={penColourPickerOpen}
      >
        <div
          className={`colour-icon`}
          style={{ backgroundColor: state.pen.color }}
        ></div>
      </EditorUIButton>
      <div
        className={`pen-colour-picker ${penColourPickerOpen ? "visible" : "hidden"}`}
      >
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
      </div>

      {/* Pen size settings */}
      <EditorUIButton
        onClick={() => {
          setPenColourPickerOpen(false);
          setPenSizePickerOpen((prev) => !prev);
        }}
        selected={penSizePickerOpen}
      >
        <div className={`pen-size`}>{size}</div>
      </EditorUIButton>
      <div
        className={`pen-size-picker ${penSizePickerOpen ? "visible" : "hidden"}`}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={size}
          step="10"
          onChange={(e) =>
            dispatch({
              type: "SET_PEN_SIZE",
              payload: Number(e.target.value),
            })
          }
        />
      </div>

      <Separator />

      {/* Text mode */}

      <EditorUIButton
        onClick={() => {
          handleSetTextMode(!isTextMode);
        }}
        selected={isTextMode}
      >
        <ListPlusIcon />
      </EditorUIButton>

      <Separator />

      {/* New Page */}
      <EditorUIButton
        onClick={() => {
          dispatch({
            type: "ADD_PAGE",
          });
        }}
      >
        <FilePlusIcon className="add-page" size={"25px"} />
      </EditorUIButton>

      <Separator />
    </div>
  );
}
