# paginated-notes

## Purpose

Top-level entry for the **paginated (A4 page) note editor**: a multi-page canvas with ink drawing, pinch-zoom, pan, text boxes, and (in progress) embedded images. This folder wires together the toolbar, canvas viewport, per-page SVG surfaces, and global React context for editor state.

## Folder structure

| Path | Role |
|------|------|
| `PaginatedNotesEditor.tsx` | Root component: context provider, touch capture for zoom, wheel pan, layout |
| `Page.tsx` | Single A4 page: SVG ink layer, live stroke preview, text boxes, image |
| `Page.css`, `PaginatedNoteEditor.css` | Page and editor layout styles |
| `state-management/` | Reducer, context, pointer handlers — see [state-management/README.md](./state-management/README.md) |
| `ui/` | Toolbar — see [ui/README.md](./ui/README.md) |
| `textbox/` | BlockNote text overlays — see [textbox/README.md](./textbox/README.md) |
| `image/` | Placeholder/demo image with resize handles — see [image/README.md](./image/README.md) |

## Important nuances

- **A4 dimensions** are fixed at 72 PPI: `595×842` px (`A4_PAGE_72PPI_W` / `A4_PAGE_72PPI_H` in `Page.tsx`).
- **Touch vs mouse/pen**: Touch pinch and single-finger “draw vs zoom” discrimination are handled on `#pages-window` in **capture** phase (`PaginatedNotesEditor.tsx`). Page SVG handlers run later; when pointer capture moves events to the active page SVG, zoom moves are still forwarded manually in `Page.tsx` when `gestureTarget === "zoom"`.
- **Pending gesture (20 ms)**: On first touch down, `gestureTarget` becomes `"pending"`. A `setTimeout(..., 20)` in `PaginatedNotesEditor` dispatches `RESOLVE_PENDING_GESTURE`. If a second finger lands within 20 ms, pinch wins (`"zoom"`); otherwise a single-finger stroke is seeded via `inkSeedFromZoomContact`.
- **Canvas centering**: `useLayoutEffect` centers pages horizontally in `#pages-window` by dispatching `PAN_CANVAS` with `left = (viewportWidth - pageWidth) / 2`.
- **Wheel pan guard**: Wheel pan only runs when `states[historyIndex].length > 0` so an empty notebook is not panned off-screen accidentally.
- **History model**: `states` is an array of notebooks; `historyIndex` points at the current snapshot. New ink/text/page edits append after slicing `states.slice(0, historyIndex + 1)` so undo branches are discarded correctly.
