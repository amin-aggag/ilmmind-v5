import type { NoteEditorProps } from "../NoteEditor";
// import { useCanvasContext } from './state-management/useCanvasContext';

// type PageNotesEditorProps = Omit<NoteEditorProps, "layout">;

// export default function PageNotesEditor({ ...props }: PageNotesEditorProps) {
//     return (
//         <>
//             <DrawingCanvas/>
//         </>
//     )
// }
import "./PaginatedNoteEditor.css";

// pages/SVGCanvas.tsx
import {
  CanvasContext,
  useCanvasStateVars,
} from "./state-management/useCanvasContext";
import UI from "./ui/UI";
import { MouseEventHandler, useEffect, useRef } from "react";

type PageNotesEditorProps = Omit<NoteEditorProps, "layout">;

export default function PaginatedNotesEditor() {
  const canvasStateVars = useCanvasStateVars();
  const { states, position, historyIndex } = canvasStateVars.state;
  const dispatch = canvasStateVars.dispatch;
  const DrawingCanvasRef = useRef<HTMLDivElement>(null);

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
          style={{ height: "100%", overflow: "hidden" }}
          className="pages-window"
        >
          <div
            style={{
              position: "relative",
              transform: `translate(${position.left}px, ${position.top}px)`,
              height: "min-content",
              width: "min-content",
            }}
            className="svg-canvases-wrapper"
          >
            {states[historyIndex].map((_, pageIndex) => (
              <SVGCanvas pageIndex={pageIndex} key={pageIndex} />
            ))}
          </div>
        </div>
      </div>
    </CanvasContext.Provider>
  );
}

// components/canvas/DrawingCanvas.tsx
import { useCanvasContext } from "./state-management/useCanvasContext";
import getStroke from "perfect-freehand";
import { TextboxComponent } from "./textbox/Textbox";

const getSvgPathFromStroke = (stroke: number[][]): string => {
  if (!stroke.length) return "";

  const d = stroke.reduce<(string | number)[]>(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"],
  );

  d.push("Z");
  return d.join(" ");
};

export const A4_PAGE_72PPI_W = 595;
export const A4_PAGE_72PPI_H = 842;

function SVGCanvas({ pageIndex }: { pageIndex: number }) {
  const { state, handlers, dispatch } = useCanvasContext();
  const { pointer, touch } = handlers;
  const { isDrawing, pen, isMovingCanvas, points, historyIndex, isTextMode } = state;

  console.log("SVGCanvas: state: ", state);

  const pageData = state.states[historyIndex][pageIndex];

  const options = {
    size: pen.size,
    smoothing: 0.01,
    thinning: 0.5,
    streamline: 0.5,
    easing: (t: number) => t,
    start: {
      taper: 0,
      cap: true,
    },
    end: {
      taper: 0,
      cap: true,
    },
  };

  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    pointer.handlePointerDown(e.nativeEvent, pageIndex);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    pointer.handlePointerMove(e.nativeEvent, pageIndex);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    pointer.handlePointerUp(e.nativeEvent, pathData, pageIndex);
  };

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    touch.handleTouchStart(e.nativeEvent);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    touch.handleTouchMove(e.nativeEvent);
  };

  const handleTouchEnd = (e: React.TouchEvent<SVGSVGElement>) => {
    touch.handleTouchEnd(e.nativeEvent);
  };

  const handleAddTextBox: MouseEventHandler<SVGSVGElement> = (e) => {
    dispatch({
      type: "ADD_TEXTBOX",
      payload: {
        pageIndex,
        position: {
          top: e.clientY,
          left: e.clientX,
        },
        size: {
          height: 200,
          width: 200,
        },
      },
    });
  };

  return (
    <div>
      <svg
        onPointerDown={
          isMovingCanvas || isTextMode ? undefined : handlePointerDown
        }
        onPointerMove={
          isMovingCanvas || isTextMode ? undefined : handlePointerMove
        }
        onPointerUp={isMovingCanvas || isTextMode ? undefined : handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={isTextMode ? handleAddTextBox : () => {}}
        style={{
          touchAction: "none",
          position: "relative",
          top: "0",
          left: "0",
          height: `${A4_PAGE_72PPI_H}px`,
          width: `${A4_PAGE_72PPI_W}`,
          zIndex: 1,
          backgroundColor: "#ffffff",
          fill: pen.color,
        }}
        className="svg-canvas"
        data-page-index={`${pageIndex}`}
        // key={index}
      >
        {pageData.svgData.map((pd, index) => (
          <path
            key={index}
            d={pd.path}
            fill={pd.color}
            style={{ zIndex: 100 }}
          />
        ))}

        {pageIndex === state.activePageIndex && isDrawing && (
          <path d={pathData} style={{ zIndex: 100 }} />
        )}
      </svg>
      {pageData.textBoxes.map((textbox, textboxIndex) => (
        <TextboxComponent
          pageIndex={pageIndex}
          textboxIndex={textboxIndex}
          textboxData={textbox}
          key={textboxIndex}
        />
      ))}
      <p className="page-number">{pageIndex + 1}</p>
    </div>
  );
}
