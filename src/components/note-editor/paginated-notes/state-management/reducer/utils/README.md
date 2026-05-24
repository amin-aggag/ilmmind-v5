# utils

## Purpose

**Shared pure helpers** for reducers and handlers: deep cloning notebooks, coordinate transforms between screen / wrapper / SVG / viewport focal space, and pinch math.

## Folder structure

| File | Role |
|------|------|
| `utils.ts` | `deepCopy`, `toPageRelativePosition` |
| `zoom-utils.ts` | SVG/wrapper mapping, zoom contacts, distance/clamp, ink seeding |

## Important nuances

- **`#canvas-wrapper-coord-svg`**: A full-size invisible SVG sibling inside `#svg-canvases-wrapper` is used as the coordinate reference for wrapper-local points (`clientToCanvasWrapperLocalPoint`). It inherits the same CSS transform as pages, so deltas match textbox/image positioning.
- **`clientToNotesViewportFocal`**: Maps screen coords to `#pages-window` space using `translate(L,T) scale(S)` with origin `0 0` — must stay consistent with the inline transform on the wrapper in `PaginatedNotesEditor.tsx`.
- **`zoomPointerContactFromEvent`**: Builds `ZoomPointerContact` for reducers; falls back to raw client offset if CTM mapping fails.
- **`inkSeedFromZoomContact`**: Uses `document.elementFromPoint` + `data-page-index` on `.svg-canvas` to start a touch stroke after pending resolve; pressure defaults to `0.5`.
- **`screenDeltaToCanvasWrapperLocalDelta`**: Used by textbox drag so movement stays correct under zoom (unlike image drag which divides `movementX/Y` by scale manually).
- **`deepCopy`**: Generic recursive clone used when branching notebook history; required because nested `textBoxes` / `svgData` must not alias across history indices.
