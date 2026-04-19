// components/ui/UI.tsx
import { useRef } from 'react';
import { useCanvasContext } from '../state-management/useCanvasContext';
import {
  FilePlusIcon,
  HouseIcon,
  MinusIcon,
  PenIcon,
  PlusIcon,
  RedoIcon,
  StickyNoteIcon,
  TextIcon,
  UndoIcon,
} from "lucide-react";
import './UI.css'

import { EditorUIButton } from "./EditorButton";
import { Separator } from "./Separator";

const colorArray = [
  'black',
  'orange',
  'mediumseagreen',
  'tomato',
  'violet',
  'dodgerblue',
  'slateblue',
  'lightgray',
] as const;

const penSizeArray = [1, 2, 4, 6, 8, 10, 20, 30] as const;

export default function UI() {
  const { state, dispatch } = useCanvasContext();

  const { states, index, pen, isTextMode } = state;
  const { color, size } = pen;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };

  const handlePenSizeChange = (newSize: number) => {
    dispatch({
      type: 'SET_PEN_SIZE',
      payload: newSize,
    });
  };

  const handleColorChange = (newColor: string) => {
    dispatch({
      type: 'SET_PEN_COLOR',
      payload: newColor,
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

  const isUndoDisabled = states.length === 1 || index <= 0;
  const isRedoDisabled =
    (states.length === 1 && index <= 0) || index === states.length - 1;

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
        onClick={() => {
          handleSetTextMode(true);
        }}
        selected={isTextMode == true}
      >
        <TextIcon />
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
    </div>
  );

  return (
    <>
      <div
        style={{
          position: 'relative',
          top: '0',
          left: '0px',
          fontSize: '50px',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'row',
          background: 'aliceblue',
          width: 'auto',
          minHeight: '100px',
          marginBlock: 'auto',
          alignItems: 'center',
          padding: '17px',
          borderBottomRightRadius: '10px',
          borderBottomLeftRadius: '10px',
          borderStyle: 'hidden',
          boxShadow: '1px 1px 4px 1px lightgray',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}
      >
        {/* Undo/Redo Buttons */}
        <div>
          <button
            style={{
              ...buttonStyle,
              marginRight: '15px',
            }}
            onClick={handleUndo}
            disabled={isUndoDisabled}
          >
            Undo
          </button>
          <button
            style={buttonStyle}
            onClick={handleRedo}
            disabled={isRedoDisabled}
          >
            Redo
          </button>
        </div>

        {/* Pen Size Selector */}
        <div
          style={{
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'aliceblue',
            height: '75px',
            marginTop: '5px',
          }}
        >
          <p style={{ marginBottom: '5px', fontSize: '20px' }}>Pen size: {size}</p>
          <div style={{ display: 'flex' }}>
            {penSizeArray.map((penSize) => (
              <button
                style={{
                  height: '40px',
                  width: '40px',
                  background: 'aliceblue',
                  cursor: 'pointer',
                  fontSize: '30px',
                  borderRadius: '10px',
                  borderColor: 'lightgray',
                  borderStyle: 'hidden',
                  boxShadow: '1px 1px 4px 1px lightgray',
                  marginRight: '10px',
                }}
                key={penSize}
                onClick={() => handlePenSizeChange(penSize)}
              >
                {penSize}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selector */}
        <div
          style={{
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'aliceblue',
            height: '75px',
          }}
        >
          <p style={{ fontSize: '20px', marginBottom: '5px' }}>
            Colour: {String(color).charAt(0).toUpperCase() + String(color).slice(1)}
          </p>
          <div style={{ display: 'flex' }}>
            {colorArray.map((colorOption) => (
              <button
                style={{
                  height: '40px',
                  width: '40px',
                  background: colorOption,
                  cursor: 'pointer',
                  borderRadius: '10px',
                  borderColor: 'lightgray',
                  borderStyle: 'hidden',
                  boxShadow: '1px 1px 4px 1px lightgray',
                  marginRight: '10px',
                }}
                key={colorOption}
                onClick={() => handleColorChange(colorOption)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}