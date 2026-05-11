import {
  CanvasState,
  ZoomPointerContact,
  Point,
} from "../../CanvasContextTypes";

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

/** Wrapper-content delta between two screen points (same space as drawing / textbox `left`/`top`). */
export function screenDeltaToCanvasWrapperLocalDelta(
  prevClientX: number,
  prevClientY: number,
  nextClientX: number,
  nextClientY: number,
): { x: number; y: number } | null {
  const prev = clientToCanvasWrapperLocalPoint(prevClientX, prevClientY);
  const next = clientToCanvasWrapperLocalPoint(nextClientX, nextClientY);
  if (!prev || !next) return null;
  return { x: next.x - prev.x, y: next.y - prev.y };
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
  e: Pick<
    PointerEvent,
    "clientX" | "clientY" | "pointerId" | "timeStamp" | "pointerType"
  >,
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
  const base = {
    pointerId: e.pointerId,
    timeStamp: e.timeStamp,
    pointerType: e.pointerType as ZoomPointerContact["pointerType"],
    clientX: e.clientX,
    clientY: e.clientY,
  };
  if (mapped) {
    return { ...base, x: mapped.x, y: mapped.y };
  }
  const viewport = getNotesViewportRect();
  if (viewport) {
    return {
      ...base,
      x: e.clientX - viewport.left,
      y: e.clientY - viewport.top,
    };
  }
  return { ...base, x: e.clientX, y: e.clientY };
}

/** Remove one pointer and compact keys to 1..n (pinch slot order). */
export function removeZoomPointerById(
  map: Map<number, ZoomPointerContact>,
  pointerId: number,
): Map<number, ZoomPointerContact> {
  const values = [...map.values()].filter((c) => c.pointerId !== pointerId);
  const next = new Map<number, ZoomPointerContact>();
  values.forEach((c, i) => {
    next.set(i + 1, c);
  });
  return next;
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

/** Map a pending zoom contact to the first ink sample for that page, if the finger is over a page SVG. */
export function inkSeedFromZoomContact(
  contact: ZoomPointerContact,
  pressure = 0.5,
): { points: Point[]; activePageIndex: number } | null {
  const el = document.elementFromPoint(contact.clientX, contact.clientY);
  const svg = el?.closest(".svg-canvas") as SVGSVGElement | null;
  if (!svg) return null;
  const pt = clientToSvgUserPoint(svg, contact.clientX, contact.clientY);
  if (!pt) return null;
  const raw = svg.dataset.pageIndex;
  if (raw === undefined) return null;
  const activePageIndex = Number.parseInt(raw, 10);
  if (Number.isNaN(activePageIndex)) return null;
  return {
    points: [[pt.x, pt.y, pressure]],
    activePageIndex,
  };
}
