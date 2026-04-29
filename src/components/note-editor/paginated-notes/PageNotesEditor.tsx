// import type { NoteEditorProps } from "../NoteEditor";
// import { useCanvasContext } from './state-management/useCanvasContext';

// type PageNotesEditorProps = Omit<NoteEditorProps, "layout">;

// export default function PageNotesEditor({ ...props }: PageNotesEditorProps) {
//     return (
//         <>
//             <DrawingCanvas/>
//         </>
//     )
// }
import { Page } from "./Page";
import "./PaginatedNoteEditor.css";

// pages/SVGCanvas.tsx
import {
  CanvasContext,
  useCanvasStateVars,
} from "./state-management/useCanvasContext";
import UI from "./ui/UI";
import React, { useEffect, useRef } from "react";

// type PageNotesEditorProps = Omit<NoteEditorProps, "layout">;

export default function PaginatedNotesEditor() {
  const canvasStateVars = useCanvasStateVars();
  const { states, position, historyIndex } = canvasStateVars.state;
  const { startScale } = canvasStateVars.state.scalingValues;
  const dispatch = canvasStateVars.dispatch;
  const DrawingCanvasRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    dispatch({
      type: "ZOOM_POINTER_DOWN",
      payload: {
        e,
      },
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    e.preventDefault();
    dispatch({
      type: "ZOOM_POINTER_MOVE",
      payload: {
        e,
      },
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    dispatch({
      type: "ZOOM_POINTER_UP",
    });
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    e.preventDefault();
    dispatch({
      type: "ZOOM_POINTER_CANCEL",
    });
  };

  useEffect(() => {
    const CanvasRefCurrent = DrawingCanvasRef.current;

    if (!CanvasRefCurrent) return;

    const handleWheelWrapper = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Pan the canvas if there are pages on the screen that can be panned across.
      // This condition prevents the user from accidently panning and then when making a page,
      // the pan is far enough that the page is off screen and difficult to pan back to view again.
      if (
        canvasStateVars.state.states[canvasStateVars.state.historyIndex]
          .length > 0
      ) {
        dispatch({
          type: "PAN_CANVAS",
          payload: {
            left: position.left - e.deltaX,
            top: position.top - e.deltaY,
          },
        });
      }
    };

    CanvasRefCurrent.addEventListener("wheel", handleWheelWrapper);

    return () =>
      CanvasRefCurrent.removeEventListener("wheel", handleWheelWrapper);
  });

  // console.log(states[historyIndex]);

  return (
    <CanvasContext.Provider value={canvasStateVars}>
      <div
        style={{
          overflow: "hidden",
          overscrollBehavior: "none",
          scrollbarWidth: "none",
          gridTemplateRows: "auto 1fr",
          height: "100%",
        }}
      >
        <div>
          <UI />
        </div>
        <div
          ref={DrawingCanvasRef}
          style={{ height: "100%", overflow: "hidden", scale: `${startScale}` }}
          className="pages-window"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div
            style={{
              position: "relative",
              transform: `translate(${position.left}px, ${position.top}px)`,
              height: "min-content",
              width: "min-content",
            }}
            id="svg-canvases-wrapper"
          >
            {states[historyIndex].map((_, pageIndex) => (
              <Page pageIndex={pageIndex} key={pageIndex} />
            ))}
          </div>
        </div>
      </div>
    </CanvasContext.Provider>
  );
}
