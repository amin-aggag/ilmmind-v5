# image

## Purpose

**Prototype embedded image** on a page: local React state for bounds/selection, drag-to-move, and resize handles when selected. Not yet persisted in `CanvasState` / notebook history — uses `ImageContext` only.

## Folder structure

| File | Role |
|------|------|
| `Image.tsx` | Grid layout of image + handles; provides `ImageContext` |
| `useImageContext.tsx` | `width`, `height`, `top`, `left`, `isSelected` state |
| `useImageDrag.ts` | Pointer drag + tap-to-toggle selection |
| `image.css` | Layout (CSS grid for handle rows) |
| `image-size-draggers/` | Edge and corner resize UI — [image-size-draggers/README.md](./image-size-draggers/README.md) |

## Important nuances

- **Rendered inside every `Page`**: `<Image />` is mounted per page today but shares one logical demo asset (`ilmmind-preview-image-v2.png`) — integration with per-page notebook data is still TODO.
- **Selection toggle**: Pointer up without movement toggles `isSelected`; movement sets `pointerWasMoved` so click-vs-drag is distinguished.
- **Zoom compensation**: Drag and resize divide `movementX/Y` by `scalingValues.startScale` from canvas context so apparent size/position stay stable under pinch zoom (differs from textbox drag which uses wrapper-local deltas).
- **Move only when selected**: `handleImageDragPointerMove` returns early if `!isSelected`.
- **Cursor delay**: `useLayoutEffect` in `useImageDrag` applies `cursor: move` only after ~60 ms when selected and moving, to avoid flash on simple select/deselect.
- **`stopPropagation`**: Image handlers call `preventDefault` and `stopPropagation` so image interaction does not start ink on the SVG underneath.
