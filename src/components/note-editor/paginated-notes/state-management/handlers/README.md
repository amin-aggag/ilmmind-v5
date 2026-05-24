# handlers

## Purpose

**Event adapters** between raw `PointerEvent`s on page SVGs and canvas reducer actions for **inking** (`POINTER_DOWN` / `POINTER_MOVE` / `POINTER_UP`). Keeps coordinate conversion and gesture guards out of `Page.tsx`.

## Folder structure

Flat folder — single module:

| File | Role |
|------|------|
| `usePointerHandler.ts` | `usePointerHandlers(state, dispatch)` → `handlePointerDown/Move/Up` |

## Important nuances

- **SVG user space**: Points are converted with `clientToSvgUserPoint` from `reducer/utils/zoom-utils.ts` so strokes stay correct under wrapper `translate` + `scale`.
- **Pointer capture**: On down, the handler calls `svg.setPointerCapture(pointerId)` so moves/up stay on the page SVG even if the finger drifts off. `PaginatedNotesEditor` additionally captures on the active page when `gestureTarget === "draw"` after pending resolution (touch path).
- **Gesture blocking**: Down is ignored when `gestureTarget` is `"pending"` or `"zoom"`, or when `isDrawing` is already true (prevents duplicate down).
- **Touch move after resolve**: For `pointerType === "touch"`, move events are accepted when `gestureTarget === "draw" && isDrawing` even if `e.buttons !== 1`, because touch may not set button state the same way as mouse.
- **Up does not clear gesture**: `POINTER_UP` is handled in `reducer/drawing-pointer.ts`, which resets `gestureTarget` to `"idle"` when a stroke completes.
