import { PartialBlock } from "@blocknote/core";
import React from "react";

export type SvgPathData = {
  path: string;
  color: string;
};

export type Textbox = {
  textData: PartialBlock[] | undefined;
  position: {
    // These position coordinates are relative to the top left of the page
    // the textbox is located on.
    top: number;
    left: number;
  };
  size: {
    height: number;
    width: number;
  };
};

export type Page = {
  svgData: SvgPathData[];
  textBoxes: Textbox[];
};

export type Notebook = Page[];

export type Point = [number, number, number]; // [x, y, pressure]

/** Pinch sample in #pages-window space (same units as position.left/top). */
export type ZoomPointerContact = {
  pointerId: number;
  x: number;
  y: number;
};

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
  isDraggingTextbox: boolean;
  textboxInteractionPosition: Textbox["position"] | null;

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
  isPinching: boolean;
  scalingValues: {
    startDistance: number;
    startScale: number;
  };
  zoomPointerEvents: Map<number, ZoomPointerContact>;
  zoomPointersHaveUpdated: boolean;
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
      type: "ZOOM_POINTER_DOWN";
      payload: {
        contact: ZoomPointerContact;
      };
    }
  | {
      type: "ZOOM_POINTER_MOVE";
      payload: {
        contact: ZoomPointerContact;
      };
    }
  | {
      type: "ZOOM_POINTER_UP";
    }
  | {
      type: "ZOOM_POINTER_CANCEL";
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
    }
  | {
      type: "ADD_TEXTBOX";
      payload: {
        pageIndex: number;
      } & Omit<Textbox, "textData">;
    }
  | {
      type: "UPDATE_TEXTBOX";
      payload: {
        pageIndex: number;
        textboxIndex: number;
        newTextBoxData: PartialBlock[] | undefined;
      };
    }
  | {
      type: "DRAG_TEXTBOX_POINTER_MOVE";
      payload: {
        pageIndex: number;
        textboxIndex: number;
        delta: {
          x: number;
          y: number;
        };
      };
    }
  | {
      type: "DRAG_TEXTBOX_POINTER_UP";
      payload: {
        pageIndex: number;
        textboxIndex: number;
      };
    };

export type ActionOf<TType extends CanvasAction["type"]> = Extract<
  CanvasAction,
  { type: TType }
>;

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
  };
};
