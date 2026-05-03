import { CanvasState } from "../../CanvasContextTypes";

export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item) as unknown) as T;
  }
  const copy = {} as T;
  const record = obj as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    (copy as Record<string, unknown>)[key] = deepCopy(record[key]);
  }
  return copy;
}

export const toPageRelativePosition = (
  position: {
    top: number;
    left: number;
  },
  pageRect: DOMRect,
): {
  top: number;
  left: number;
} => ({
  ...position,
  top: position.top - pageRect.top,
  left: position.left - pageRect.left,
});

/** `getBoundingClientRect()` of `.pages-window` (parent of `#svg-canvases-wrapper`). */
export function getNotesViewportRect(): DOMRect | undefined {
  const wrapper = document.getElementById("svg-canvases-wrapper");
  const r = wrapper?.parentElement?.getBoundingClientRect();
  return r ?? undefined;
}

export function distance(
  touchA: {
    x: number;
    y: number;
  },
  touchB: {
    x: number;
    y: number;
  },
): number {
  const dx = touchB.x - touchA.x;
  const dy = touchB.y - touchA.y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function clamp(
  nextScale: number,
  minScale: number,
  maxScale: number,
): number {
  if (nextScale <= minScale) return minScale;

  if (nextScale >= maxScale) return maxScale;

  return nextScale;
}

/** Keeps the pinch midpoint fixed in `pages-window` while scale changes (translate + scale, origin 0 0). */
export function panForZoomAroundFocal(
  position: CanvasState["position"],
  scaleBefore: number,
  scaleAfter: number,
  focalClientX: number,
  focalClientY: number,
  viewport: DOMRect,
): CanvasState["position"] {
  if (scaleBefore <= 0) return position;
  const pfx = focalClientX - viewport.left;
  const pfy = focalClientY - viewport.top;
  const ratio = scaleAfter / scaleBefore;
  return {
    left: pfx - (pfx - position.left) * ratio,
    top: pfy - (pfy - position.top) * ratio,
  };
}
