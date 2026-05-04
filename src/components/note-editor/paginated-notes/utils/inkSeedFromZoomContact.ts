import type { Point, ZoomPointerContact } from "../state-management/CanvasContextTypes";
import { clientToSvgUserPoint } from "../state-management/reducer/utils/zoom-utils";

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
