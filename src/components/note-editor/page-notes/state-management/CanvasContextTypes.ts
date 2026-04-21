export type SvgPathData = {
  path: string;
  color: string;
};

export type Page = SvgPathData[];
export type Notebook = Page[];

export type Point = [number, number, number]; // [x, y, pressure]

export type CanvasState = {
  // Drawing state
  points: Point[];
  allPathData: SvgPathData[];
  states: Notebook[];
  historyIndex: number;
  isDrawing: boolean;

  // Page state
  activePageIndex: number;

  // Text state
  isTextMode: boolean;

  // Canvas viewport
  position: {
    left: number;
    top: number;
  };

  // Pen settings
  pen: {
    color: string;
    size: number;
  };

  // Interaction state
  isMovingCanvas: boolean;
  touchStart: {
    x: number;
    y: number;
  } | null;
};

export type CanvasAction =
  | {
      type: "POINTER_DOWN";
      payload: {
        points: Point[];
        activePageIndex: number;
      };
    }
  | {
      type: "POINTER_MOVE";
      payload: {
        points: Point[];
        activePageIndex: number;
      };
    }
  | {
      type: "POINTER_UP";
      payload: {
        pathData: string;
        activePageIndex: number;
      };
    }
  | {
      type: "SET_PEN_COLOR";
      payload: string;
    }
  | {
      type: "SET_PEN_SIZE";
      payload: number;
    }
  | {
      type: "PAN_CANVAS";
      payload: {
        left: number;
        top: number;
      };
    }
  | {
      type: "SET_MOVING_CANVAS";
      payload: boolean;
    }
  | {
      type: "SET_TOUCH_START";
      payload: {
        x: number;
        y: number;
      } | null;
    }
  | {
      type: "UNDO";
    }
  | {
      type: "REDO";
    }
  | {
      type: "SET_TEXT_MODE";
      payload: {
        isTextMode: boolean;
      };
    }
  | {
      type: "ADD_PAGE";
    };

export type CanvasContextValue = {
  state: CanvasState;
  dispatch: React.Dispatch<CanvasAction>;
  handlers: {
    pointer: {
      handlePointerDown: (e: PointerEvent, activePageIndex: number) => void;
      handlePointerMove: (e: PointerEvent, activePageIndex: number) => void;
      handlePointerUp: (
        e: PointerEvent,
        pathData: string,
        activePageIndex: number,
      ) => void;
    };
    touch: {
      handleTouchStart: (e: TouchEvent) => void;
      handleTouchMove: (e: TouchEvent) => void;
      handleTouchEnd: (e: TouchEvent) => void;
    };
  };
};