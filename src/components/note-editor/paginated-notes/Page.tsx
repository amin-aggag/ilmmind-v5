import { useCanvasContext } from "./state-management/useCanvasContext";
import getStroke from "perfect-freehand";
import { TextboxComponent } from "./textbox/Textbox";
import { MouseEventHandler } from "react";
import './page.css';

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

export function Page({ pageIndex }: { pageIndex: number }) {
  const { state, handlers, dispatch } = useCanvasContext();
  const { pointer } = handlers;
  const {
    isDrawing,
    pen,
    isMovingCanvas,
    points,
    historyIndex,
    isTextMode,
    isDraggingTextbox,
    isPinching,
  } = state;

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
    // Pointer capture on the SVG retargets moves here; the parent
    // `pages-window` listener never sees them, so zoom must be updated too.
    if (isPinching) {
      dispatch({
        type: "ZOOM_POINTER_MOVE",
        payload: { e },
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    pointer.handlePointerUp(e.nativeEvent, pathData, pageIndex);
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
          isMovingCanvas || isTextMode || isDraggingTextbox || isPinching
            ? undefined
            : handlePointerDown
        }
        onPointerMove={
          isMovingCanvas || isTextMode || isDraggingTextbox || isPinching
            ? undefined
            : handlePointerMove
        }
        onPointerUp={
          isMovingCanvas || isTextMode || isDraggingTextbox || isPinching
            ? undefined
            : handlePointerUp
        }
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
