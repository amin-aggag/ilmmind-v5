# reducer

## Purpose

**Pure reducer functions** for each canvas action type. `useCanvasReducer.ts` imports these and routes `CanvasAction` payloads here. Logic is split by feature rather than one large file.

## Folder structure


| Path                 | Role                                                                               |
| -------------------- | ---------------------------------------------------------------------------------- |
| `drawing-pointer.ts` | Ink stroke lifecycle: down → move → commit path to page history                    |
| `viewport.ts`        | `PAN_CANVAS`, `SET_MOVING_CANVAS`                                                  |
| `history.ts`         | `UNDO` / `REDO` (index only — snapshots already in `states`)                       |
| `pages.ts`           | `ADD_PAGE` — append empty page to notebook                                         |
| `textboxes/`         | Textbox CRUD and drag — [textboxes/README.md](./textboxes/README.md)               |
| `zoom-pointer/`      | Touch pinch + pending gesture — [zoom-pointer/README.md](./zoom-pointer/README.md) |
| `utils/`             | Shared helpers — [utils/README.md](./utils/README.md)                              |


Pen color/size and `SET_TEXT_MODE` are inlined in `useCanvasReducer.ts`.

## Important nuances

- **Immutable history append**: Mutating actions (draw up, add textbox, add page, drag textbox up) follow the same pattern: `updatedState = state.states.slice(0, historyIndex + 1)`, mutate a deep-copied notebook, then `states: [...updatedState, updatedNotebook]` and `historyIndex + 1`. Never use `state.states.slice()` without the `historyIndex + 1` upper bound — that was a past bug that broke undo branching (see comment in `reducerHandleDragTextboxPointerUp.ts`).
- **Drawing down guard**: `reducerHandleDrawingPointerDown` only starts a stroke when `gestureTarget === "idle"`. Touch strokes that begin after pending resolution use `gestureTarget === "draw"` set by `reducerHandleResolvePendingGesture`, not this handler’s down path.
- **Live preview vs committed ink**: `points` in state hold the in-progress stroke; `Page.tsx` runs `perfect-freehand` for preview. On up, `pathData` is stored in `page.svgData` with pen color.

