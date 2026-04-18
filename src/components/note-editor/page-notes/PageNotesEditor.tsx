import type { NoteEditorProps } from "../NoteEditor"
// import { useCanvasContext } from './state-management/useCanvasContext';

// type PageNotesEditorProps = Omit<NoteEditorProps, "layout">;

// export default function PageNotesEditor({ ...props }: PageNotesEditorProps) {
//     return (
//         <>
//             <DrawingCanvas/>
//         </>
//     )
// }

// pages/SVGCanvas.tsx
import { CanvasContext, useCanvasStateVars } from './state-management/useCanvasContext';
import UI from './ui/UI';
import { useEffect, useRef } from 'react';

type PageNotesEditorProps = Omit<NoteEditorProps, "layout">;

export default function SVGCanvas() {
  const canvasStateVars = useCanvasStateVars();
  const { position } = canvasStateVars.state;
  const dispatch = canvasStateVars.dispatch;
  const DrawingCanvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const CanvasRefCurrent = DrawingCanvasRef.current;

    if (!CanvasRefCurrent) return;

    const handleWheelWrapper = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Handle wheel here if needed

      dispatch({
        type: "PAN_CANVAS",
        payload: {
          left: position.left - e.deltaX,
          top: position.top - e.deltaY,
        },
      });
    };

    CanvasRefCurrent.addEventListener('wheel', handleWheelWrapper);

    return () =>
      CanvasRefCurrent.removeEventListener('wheel', handleWheelWrapper);
  });

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
        <div ref={DrawingCanvasRef} style={{ height: "100%" }}>
          <div
            style={{
              position: "relative",
              transform: `translate(${position.left}px, ${position.top}px)`,
              height: "100%",
              width: "100%",
            }}
          >
            <DrawingCanvas />
          </div>
        </div>
      </div>
    </CanvasContext.Provider>
  );
}

// components/canvas/DrawingCanvas.tsx
import { useCanvasContext } from './state-management/useCanvasContext';
import getStroke from 'perfect-freehand';

const getSvgPathFromStroke = (stroke: number[][]): string => {
  if (!stroke.length) return '';

  const d = stroke.reduce<(string | number)[]>(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
};

function DrawingCanvas() {
  const { state, handlers } = useCanvasContext();
  const { pointer, touch } = handlers;
  const { allPathData, isDrawing, pen, isMovingCanvas, points } = state;

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
    pointer.handlePointerDown(e.nativeEvent);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    pointer.handlePointerMove(e.nativeEvent);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    pointer.handlePointerUp(e.nativeEvent, pathData);
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

  return (
    <svg
      onPointerDown={isMovingCanvas ? undefined : handlePointerDown}
      onPointerMove={isMovingCanvas ? undefined : handlePointerMove}
      onPointerUp={isMovingCanvas ? undefined : handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: "none",
        position: "relative",
        top: "0",
        left: "0",
        height: "400px",
        width: "300px",
        zIndex: 1,
        backgroundColor: "#ffffff",
        fill: pen.color,
      }}
    >
      {allPathData.map((pd, index) => (
        <path key={index} d={pd.path} fill={pd.color} style={{ zIndex: 100 }} />
      ))}
      {isDrawing && <path d={pathData} style={{ zIndex: 100 }} />}
    </svg>
  );
}