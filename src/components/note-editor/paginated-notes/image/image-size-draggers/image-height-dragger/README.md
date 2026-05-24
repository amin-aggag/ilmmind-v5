# image-height-dragger

## Purpose

**Vertical edge resize** for the image: hit targets on the top and bottom of the selected image. Adjusts height (and `top` when dragging the top edge).

## Folder structure

| File | Role |
|------|------|
| `ImageHeightDragger.tsx` | Div with pointer handlers; `side` prop `"top" \| "bottom"` |
| `useImageAdjustHeight.ts` | Resize logic and `ns-resize` cursor on `#root` |
| `imageHeightDragger.css` | Hit area styling |

## Important nuances

- **Top edge**: Adjusts `top` and reduces `height` by `movementY / zoomLevel` so the bottom edge stays fixed.
- **Bottom edge**: Only changes `height`.
- **Symmetry with width dragger**: Same zoom division and pointer-capture lifecycle as `image-width-dragger`.
