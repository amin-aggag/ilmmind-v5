# ui

## Purpose

**Editor toolbar** for paginated notes: undo/redo, pen vs text mode, pen color and size, and add page. Dispatches canvas actions via `useCanvasContext`; no local canvas state beyond picker open/close UI.

## Folder structure

| File | Role |
|------|------|
| `UI.tsx` | Main toolbar layout and dispatch wiring |
| `EditorButton.tsx` | Reusable toolbar button (selected/disabled styles) |
| `Separator.tsx` | Visual divider between tool groups |
| `UI.css`, `EditorButton.css`, `separator.css` | Toolbar styling |
| `dropdown-menu/` | Unused Radix UI demo scaffold — not wired into `UI.tsx` |

## Important nuances

- **Undo/redo disabled rules**: Undo disabled when `historyIndex <= 0` or only one frame; redo disabled at the end of `states` or when there is nowhere to go forward.
- **Pen vs text mode**: Selecting the pen tool dispatches `SET_TEXT_MODE` false. Text mode button toggles `isTextMode`; while true, `Page.tsx` uses SVG `onClick` to place text boxes instead of drawing.
- **Color picker toggles**: Opening pen color closes pen size picker and vice versa (`setPenSizePickerOpen(false)` etc.).
- **Pen size**: Range input `0–100` step `10` dispatches `SET_PEN_SIZE` (default pen size in reducer is `10`).
- **Add page**: `ADD_PAGE` appends an empty `{ svgData: [], textBoxes: [] }` page and advances history — same branching rules as other edits.
