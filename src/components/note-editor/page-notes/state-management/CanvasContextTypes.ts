// types/CanvasContextTypes.ts
import { PointerEventHandler, TouchEventHandler, WheelEventHandler } from "react";

export type SvgPathData = {
  path: string;
  color: string;
};

export type Point = [number, number, number]; // [x, y, pressure]

export type CanvasState = {
  // Drawing state
  points: Point[];
  allPathData: SvgPathData[];
  states: SvgPathData[][];
  index: number;
  isDrawing: boolean;

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
      };
    }
  | {
      type: "POINTER_MOVE";
      payload: {
        points: Point[];
      };
    }
  | {
      type: "POINTER_UP";
      payload: {
        pathData: string;
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
      handlePointerDown: (e: PointerEvent) => void;
      handlePointerMove: (e: PointerEvent) => void;
      handlePointerUp: (e: PointerEvent, pathData: string) => void;
    };
    touch: {
      handleTouchStart: (e: TouchEvent) => void;
      handleTouchMove: (e: TouchEvent) => void;
      handleTouchEnd: (e: TouchEvent) => void;
    };
  };
};