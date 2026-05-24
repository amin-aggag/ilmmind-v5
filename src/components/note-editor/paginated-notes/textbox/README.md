# textbox

## Purpose

**Rich text overlays** on each page using BlockNote: render, edit, drag via handlebar, and sync content/position with canvas reducer history.

## Folder structure

| File | Role |
|------|------|
| `Textbox.tsx` | `TextboxComponent` — BlockNote view, wrapper positioning, drag handle |
| `useTextboxDrag.ts` | Pointer handlers for drag + `UPDATE_TEXTBOX` on change |
| `textbox.css` | Wrapper and handlebar styles |

## Important nuances

- **Position stacking**: `top` in inline style adds `pageIndex * (A4_PAGE_72PPI_H + 35)` so text boxes stack vertically with multi-page scroll layout (35 px is the gap between pages in the layout).
- **Drag vs stored position**: While dragging, UI reads `textboxInteractionPosition` from canvas state; otherwise `textboxData.position` from history.
- **Zoom-aware drag**: Deltas use `screenDeltaToCanvasWrapperLocalDelta` (wrapper-local), not raw `movementX/Y`, so drag stays aligned when the canvas is scaled.
- **BlockNote remount on undo/redo**: `useCreateBlockNote` dependency array includes `userHasUndoneOrRedone` (`states.length - 1 - historyIndex`) so the editor reloads when the user moves through history.
- **History on every change**: `handleEditorOnChange` dispatches `UPDATE_TEXTBOX` with full `editor.document` — frequent history entries while typing (may want debouncing later).
- **data attributes**: `data-textbox-index` on wrapper and handlebar must match selectors used in `useCanvasReducer` for drag DOM queries.
