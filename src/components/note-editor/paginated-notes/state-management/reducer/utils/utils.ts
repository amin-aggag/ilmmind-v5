export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item)) as T;
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
) => ({
  ...position,
  top: position.top - pageRect.top,
  left: position.left - pageRect.left,
});
