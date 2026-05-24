# image-size-draggers

## Purpose

**Resize affordances** shown when an image is selected: corner proportional resize, and edge-only width or height adjustment. Each variant is a small div with pointer handlers and co-located CSS.

## Folder structure

| Subfolder | Role |
|-----------|------|
| `adjustment-circles/` | Corner handles (diagonal resize) — [adjustment-circles/README.md](./adjustment-circles/README.md) |
| `image-width-dragger/` | Left/right edge handles — [image-width-dragger/README.md](./image-width-dragger/README.md) |
| `image-height-dragger/` | Top/bottom edge handles — [image-height-dragger/README.md](./image-height-dragger/README.md) |

`Image.tsx` lays out handles in a 3×3 CSS grid around the `<img>` when `isSelected` is true.

## Important nuances

- **Only visible when selected**: All dragger components mount conditionally with `isSelected` in `Image.tsx`.
- **Shared zoom rule**: Every hook reads `CanvasState.scalingValues.startScale` and divides pointer movement by it so resize speed matches on-screen pixels at any zoom level.
- **Opposite-edge anchoring**: Left/top drags adjust `left`/`top` as well as `width`/`height` so the far edge stays fixed; right/bottom drags only change width/height.
- **Global cursor**: While resizing, hooks set `#root` cursor (`ew-resize`, `ns-resize`, or diagonal variants) because the pointer may leave the small hit target during drag.
