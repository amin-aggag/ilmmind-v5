# state-management

## Purpose

Central **state and dispatch layer** for the paginated editor: React context, the main `useReducer` canvas reducer, shared TypeScript types, and thin pointer event adapters that translate DOM events into reducer actions.

## Folder structure

| Path | Role |
|------|------|
| `CanvasContextTypes.ts` | `CanvasState`, `CanvasAction`, domain types (`Page`, `Textbox`, `GestureTarget`, etc.) |
| `useCanvasReducer.ts` | `canvasReducer` switch — delegates to feature reducers |
| `useCanvasContext.tsx` | `CanvasContext`, `useCanvasStateVars`, `useCanvasContext` |
| `handlers/` | SVG drawing pointer handlers — [handlers/README.md](./handlers/README.md) |
| `reducer/` | Pure state transitions — [reducer/README.md](./reducer/README.md) |

## Important nuances

- **`useCanvasStateVars`** composes `[state, dispatch]` from `useCanvasReducer` with `usePointerHandlers` and exposes `handlers.pointer` on the context value. Components should prefer `useCanvasContext()` over calling the reducer hook directly.
- **DOM reads in the reducer**: `DRAG_TEXTBOX_POINTER_MOVE` is special — `useCanvasReducer` queries `.svg-canvas`, `.textbox-wrapper`, and `#svg-canvases-wrapper` in the browser before calling the textbox drag reducer. Keep those selectors in sync with markup in `Page.tsx` / `Textbox.tsx`.
- **Image state is separate**: Image position/size live in local `ImageContext` (`image/useImageContext.tsx`), not in `CanvasState`. Only zoom scale is read from canvas state for coordinate correction.
- **`gestureTarget`** (`"idle" | "pending" | "zoom" | "draw"`) is the switch that coordinates touch pinch, deferred single-finger ink, and blocking normal SVG handlers. See [reducer/zoom-pointer/README.md](./reducer/zoom-pointer/README.md).
