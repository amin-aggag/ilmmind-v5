# textboxes

## Purpose

Reducer logic for **BlockNote text boxes** on pages: create on click, update document on edit, and drag-reposition with temporary interaction state.

## Folder structure

| File | Role |
|------|------|
| `reducerHandleAddTextbox.ts` | `ADD_TEXTBOX` — append textbox, exit text mode, push history |
| `reducerHandleUpdateTextbox.ts` | `UPDATE_TEXTBOX` — store BlockNote `PartialBlock[]` |
| `reducerHandlerDragTextboxMouseMove.ts` | `DRAG_TEXTBOX_POINTER_MOVE` — live drag position (no history commit) |
| `reducerHandleDragTextboxPointerUp.ts` | `DRAG_TEXTBOX_POINTER_UP` — commit position to history |

## Important nuances

- **Page-relative coordinates**: Textbox `position.top/left` are relative to the **page SVG** origin, not the viewport. `ADD_TEXTBOX` converts click `clientX/clientY` via `clientToSvgUserPoint` on the page SVG.
- **Drag uses two-phase state**: During drag, `textboxInteractionPosition` holds the live top/left; `DRAG_TEXTBOX_POINTER_MOVE` does **not** append history. Only pointer-up writes into `states` and clears `textboxInteractionPosition`.
- **DOM-assisted clamping**: Drag move receives `pageClickedInfo`, `textboxBeingDraggedInfo`, and `svgCanvasesWrapperInfo` from DOM queries in `useCanvasReducer`. Clamping only enforces minimum top/left against the wrapper edge (right/bottom clamps are commented out).
- **Deep copy on update**: `UPDATE_TEXTBOX` deep-copies the page so later history frames do not share BlockNote array references with earlier frames.
- **History slice**: Same `slice(0, historyIndex + 1)` pattern as drawing — required so redo branches are discarded when editing after undo.
