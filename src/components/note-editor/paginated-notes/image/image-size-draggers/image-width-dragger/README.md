# image-width-dragger

## Purpose

**Horizontal edge resize** for the image: narrow hit targets on the left and right sides of the selected image. Adjusts width only (and `left` when dragging the left edge).

## Folder structure

| File | Role |
|------|------|
| `ImageWidthDragger.tsx` | Div with pointer handlers; `side` prop `"left" \| "right"` |
| `useImageAdjustWidth.ts` | Resize logic and `ew-resize` cursor on `#root` |
| `imageWidthDragger.css` | Hit area styling |

## Important nuances

- **Left edge**: Increments `left` and decrements `width` by `movementX / zoomLevel` so the right edge stays fixed.
- **Right edge**: Only increases/decreases `width`.
- **Pointer capture**: Set on down, released on up/cancel — same pattern as height dragger and corner circles.
