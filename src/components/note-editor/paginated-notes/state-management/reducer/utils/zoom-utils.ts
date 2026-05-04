import { CanvasState, ZoomPointerContact } from "../../CanvasContextTypes";

/** `getBoundingClientRect()` of `.pages-window` (parent of `#svg-canvases-wrapper`). */
export function getNotesViewportRect(): DOMRect | undefined {
  const wrapper = document.getElementById("svg-canvases-wrapper");
  const r = wrapper?.parentElement?.getBoundingClientRect();
  return r ?? undefined;
}

/** Screen → this SVG’s user space (includes ancestor transforms such as wrapper scale). */
export function clientToSvgUserPoint(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): DOMPoint | null {
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const inv = ctm.inverse();
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  try {
    return pt.matrixTransform(inv);
  } catch {
    return null;
  }
}

/** Screen → wrapper-local px using `#canvas-wrapper-coord-svg` inside `#svg-canvases-wrapper`. */
export function clientToCanvasWrapperLocalPoint(
  clientX: number,
  clientY: number,
): DOMPoint | null {
  const svg = document.getElementById(
    "canvas-wrapper-coord-svg",
  ) as SVGSVGElement | null;
  if (!svg) return null;
  return clientToSvgUserPoint(svg, clientX, clientY);
}

/**
 * Focal in #pages-window space (same as `position.left/top`), for
 * `translate(L,T) scale(S)` on the wrapper with origin 0 0.
 */
export function clientToNotesViewportFocal(
  clientX: number,
  clientY: number,
  translateL: number,
  translateT: number,
  scale: number,
): { x: number; y: number } | null {
  const local = clientToCanvasWrapperLocalPoint(clientX, clientY);
  if (!local) return null;
  return {
    x: translateL + scale * local.x,
    y: translateT + scale * local.y,
  };
}

export function zoomPointerContactFromEvent(
  e: Pick<PointerEvent, "clientX" | "clientY" | "pointerId" | "timeStamp">,
  translateL: number,
  translateT: number,
  scale: number,
): ZoomPointerContact {
  const mapped = clientToNotesViewportFocal(
    e.clientX,
    e.clientY,
    translateL,
    translateT,
    scale,
  );
  if (mapped) {
    return { pointerId: e.pointerId, x: mapped.x, y: mapped.y, timeStamp: e.timeStamp };
  }
  const viewport = getNotesViewportRect();
  if (viewport) {
    return {
      pointerId: e.pointerId,
      x: e.clientX - viewport.left,
      y: e.clientY - viewport.top,
      timeStamp: e.timeStamp
    };
  }
  return { pointerId: e.pointerId, x: e.clientX, y: e.clientY, timeStamp: e.timeStamp };
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

/** Returns new `position` so the given viewport point stays fixed on the canvas when scale changes (uniform scale about origin with translation). */
export function translateToKeepViewportPointFixed(
  position: CanvasState["position"],
  scaleBefore: number,
  scaleAfter: number,
  focalViewportX: number,
  focalViewportY: number,
): CanvasState["position"] {
  if (scaleBefore <= 0) return position;
  const ratio = scaleAfter / scaleBefore;
  return {
    left: focalViewportX - (focalViewportX - position.left) * ratio,
    top: focalViewportY - (focalViewportY - position.top) * ratio,
  };
}
