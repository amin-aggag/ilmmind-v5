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
import { A4_PAGE_72PPI_W, Page } from "./Page";
import "./PaginatedNoteEditor.css";
import { zoomPointerContactFromEvent } from "./state-management/reducer/utils/zoom-utils";

// pages/SVGCanvas.tsx
import {
  CanvasContext,
  useCanvasStateVars,
} from "./state-management/useCanvasContext";
import type { ZoomPointerContact } from "./state-management/CanvasContextTypes";
import UI from "./ui/UI";
import React, { useEffect, useLayoutEffect, useRef } from "react";

// type PageNotesEditorProps = Omit<NoteEditorProps, "layout">;

export default function PaginatedNotesEditor(): React.ReactNode {
  const canvasStateVars = useCanvasStateVars();
  const { states, position, historyIndex } = canvasStateVars.state;
  const { startScale } = canvasStateVars.state.scalingValues;
  const dispatch = canvasStateVars.dispatch;

  const zoomContact = (e: React.PointerEvent): ZoomPointerContact =>
    zoomPointerContactFromEvent(
      e.nativeEvent,
      position.left,
      position.top,
      startScale,
    );
  const DrawingCanvasRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent): void => {
    dispatch({
      type: "ZOOM_POINTER_DOWN",
      payload: { contact: zoomContact(e) },
    });
  };

  const handlePointerMove = (e: React.PointerEvent): void => {
    e.preventDefault();
    dispatch({
      type: "ZOOM_POINTER_MOVE",
      payload: { contact: zoomContact(e) },
    });
  };

  const handlePointerUp = (e: React.PointerEvent): void => {
    e.preventDefault();
    dispatch({
      type: "ZOOM_POINTER_UP",
    });
  };

  const handlePointerCancel = (e: React.PointerEvent): void => {
    e.preventDefault();
    dispatch({
      type: "ZOOM_POINTER_CANCEL",
    });
  };

  useLayoutEffect(() => {
    const pageWindow = document.getElementById("pages-window") as HTMLElement;
    const pageWindowInfo = pageWindow.getBoundingClientRect();

    const canvasPageWidthDiff = pageWindowInfo.width - A4_PAGE_72PPI_W;
    const newPositionLeft = canvasPageWidthDiff / 2;

    dispatch({
      type: "PAN_CANVAS",
      payload: {
        left: newPositionLeft,
        top: 0,
      },
    });
  }, [dispatch]);

  useEffect(() => {
    const CanvasRefCurrent = DrawingCanvasRef.current;

    if (!CanvasRefCurrent) return;

    const handleWheelWrapper = (e: WheelEvent): void => {
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

    return (): void =>
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
          style={{ height: "100%", overflow: "hidden", touchAction: "none" }}
          className="pages-window"
          id="pages-window"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div
            style={{
              position: "relative",
              transform: `translate(${position.left}px, ${position.top}px) scale(${startScale})`,
              transformOrigin: "0 0",
              height: "min-content",
              width: "min-content",
            }}
            id="svg-canvases-wrapper"
          >
            <svg
              id="canvas-wrapper-coord-svg"
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            />
            {states[historyIndex].map((_, pageIndex) => (
              <Page pageIndex={pageIndex} key={pageIndex} />
            ))}
          </div>
        </div>
      </div>
    </CanvasContext.Provider>
  );
}
