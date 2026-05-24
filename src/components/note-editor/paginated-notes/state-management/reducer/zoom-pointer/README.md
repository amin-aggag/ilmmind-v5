# zoom-pointer

## Purpose

Touch **pinch-to-zoom** and **single-finger touch ink** coordination. Tracks active touch contacts in viewport space, pans/zooms the `#svg-canvases-wrapper` transform, and resolves ambiguous first-finger input before drawing starts.

## Folder structure

| File | Role |
|------|------|
| `reducerHandleZoomPointerDown.ts` | Register touch; first finger → `"pending"`, second → `"zoom"` + baseline distance |
| `reducerHandleZoomPointerMove.ts` | Update contacts; pinch applies scale + midpoint pan |
| `reducerHandleZoomPointerUp.ts` | Remove pointer; reset gesture when map empty or pinch ends |
| `reducerHandleZoomPointerCancel.ts` | Same cleanup path as up for cancelled pointers |
| `reducerHandleResolvePendingGesture.ts` | After delay, commit single-finger touch to draw or idle |

## Important nuances

- **Pending gesture mode (20 ms)**: The first touch sets `gestureTarget: "pending"`. `PaginatedNotesEditor` runs `setTimeout(..., 20)` and dispatches `RESOLVE_PENDING_GESTURE` only while `gestureTarget === "pending"` and exactly one contact remains. This window lets a second finger arrive for pinch before ink starts. If two fingers are down before resolve, down handler jumps straight to `"zoom"`.
- **Touch only**: All handlers no-op when `contact.pointerType !== "touch"`. Mouse/pen ink uses normal SVG handlers without this pipeline.
- **Pointer map keys**: `zoomPointerEvents` uses keys `1` and `2` (slot order), not raw `pointerId`. `removeZoomPointerById` reindexes after removal.
- **Scale limits**: Pinch clamping uses `MIN_SCALE = 0.1` and `MAX_SCALE = 4`. Each move updates `scalingValues.startDistance` and `startScale` to the latest values so zoom is incremental, not always from the initial pinch.
- **Focal-fixed zoom**: `translateToKeepViewportPointFixed` adjusts `position.left/top` so the pinch midpoint stays under the fingers when scale changes.
- **Resolve → draw**: `reducerHandleResolvePendingGesture` calls `inkSeedFromZoomContact` to place the first point in SVG space and sets `gestureTarget: "draw"`, `activeDrawPointerId`, and clears the zoom map. Text mode short-circuits to idle without drawing.
- **Page.tsx forwarding**: When the page SVG has pointer capture during zoom, `handlePointerMove` on the page also dispatches `ZOOM_POINTER_MOVE` because capture prevents the parent `#pages-window` listener from seeing moves.
- **Ink blocking**: While `"pending"` or `"zoom"`, `Page.tsx` sets `blockInkHandlers` and `pointerEvents: "none"` on the SVG (except text mode keeps `pointerEvents: "auto"` for placing text boxes).
