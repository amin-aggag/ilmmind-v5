# adjustment-circles

## Purpose

**Corner resize handles** (small circles) for the paginated-notes image. Dragging a corner updates width, height, and optionally `top`/`left` so the opposite corner stays anchored.

## Folder structure

| File | Role |
|------|------|
| `AdjCircle.tsx` | Presentational handle; `corner` prop selects CSS class and behavior |
| `useAjdCircleDrag.ts` | Pointer capture + dimension updates per corner |
| `adjCircle.css` | Corner positioning classes (`top-left`, etc.) |

## Important nuances

- **Filename typo**: Hook file is `useAjdCircleDrag.ts` (imported as `useAdjCircleDrag` from `AdjCircle.tsx`).
- **Per-corner switch**: Each corner applies a different combination of `setLeft`, `setTop`, `setWidth`, `setHeight` with sign flips on `movementX/Y / zoomLevel`.
- **Diagonal cursors**: While resizing, `#root` cursor is `nwse-resize` or `nesw-resize` depending on corner.
- **Event isolation**: All handlers use `preventDefault` and `stopPropagation` so corner drags do not bubble to image move or page ink.
