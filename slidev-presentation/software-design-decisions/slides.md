---
theme: seriph
background: https://cover.sli.dev
title: Software Design Decisions — ilmmind
info: |
  ## ilmmind — Software Design Decisions
  A walkthrough of the deliberate architectural and maintainability choices
  behind the paginated-notes editor.
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
duration: 35min
fonts:
  sans: Inter
  mono: Fira Code
---

# Software Design Decisions

### The architecture behind the **paginated-notes** editor

<div class="opacity-70 mt-4">
A tour of the deliberate choices that keep this codebase maintainable — ordered from
the structural backbone down to the smallest readability wins.
</div>

<div class="abs-br m-6 text-sm opacity-60">
React 19 · TypeScript · Tauri · SVG · BlockNote
</div>

<!--
This deck explains the *why* behind each decision, not just the *what*.
For every decision: 3 reasons it was the right call, 1–2 honest tradeoffs,
and why those tradeoffs don't hurt the project at its current stage.
-->

---
layout: default
---

# How to read each decision

<div class="grid grid-cols-3 gap-4 mt-8">

<div class="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
<div class="text-green-400 font-bold text-lg">Why it's good</div>
<div class="opacity-70 mt-2 text-sm">Three concrete reasons the decision pays off for this codebase.</div>
</div>

<div class="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
<div class="text-amber-400 font-bold text-lg">The tradeoff</div>
<div class="opacity-70 mt-2 text-sm">One or two honest downsides — every real decision has them.</div>
</div>

<div class="p-4 rounded-lg border border-sky-500/30 bg-sky-500/5">
<div class="text-sky-400 font-bold text-lg">Why it's worth it</div>
<div class="opacity-70 mt-2 text-sm">Why the downside is small, deferred, or simply doesn't bite at this stage.</div>
</div>

</div>

<div class="mt-10 opacity-70">
Decisions are ordered by <span class="text-sky-400">architectural weight</span> — from the
state-management backbone that everything else stands on, down to naming and constants.
</div>

<!--
Set the framing: this is about deliberate engineering judgement, not perfection.
Each slide follows the same three-part shape so the audience can predict the rhythm.
-->

---
layout: default
---

# Agenda — 20 decisions, four tiers

<div class="grid grid-cols-2 gap-6 mt-6 text-sm">

<div>
<div class="text-sky-400 font-bold uppercase tracking-wide text-xs mb-2">Tier 1 · Core state architecture</div>

1. `useReducer` as the state backbone
2. Feature-split pure reducers
3. Immutable undo/redo history model
4. Context API for state distribution
5. Pure reducers vs. DOM event adapters
6. Type-safe discriminated-union actions

<div class="text-sky-400 font-bold uppercase tracking-wide text-xs mb-2 mt-4">Tier 2 · Input & interaction</div>

7. Gesture state machine (`gestureTarget`)
8. Unified Pointer Events API
9. Centralised coordinate-transform utilities
</div>

<div>
<div class="text-sky-400 font-bold uppercase tracking-wide text-xs mb-2">Tier 3 · Build-vs-buy & rendering</div>

10. BlockNote for rich text
11. `perfect-freehand` for ink
12. SVG (declarative) for stroke rendering

<div class="text-sky-400 font-bold uppercase tracking-wide text-xs mb-2 mt-4">Tier 4 · Structure & maintainability</div>

13. Custom hooks for interaction logic
14. Scoped local context for prototypes
15. `deepCopy` on history branching
16. Strict TypeScript + ESLint tooling
17. Co-located README docs per folder
18. Feature-based folder structure
19. Provider-guard context hooks
20. Intention-revealing names & constants
</div>

</div>

<!--
Four tiers descending in weight. Tier 1 is the foundation everything else depends on.
You can skip lower-tier slides if you're short on time.
-->

---
layout: section
---

# Tier 1
## Core State Architecture

<div class="opacity-60 mt-2">The backbone everything else is built on</div>

---
layout: default
---

# 01 · `useReducer` as the state backbone

<div class="opacity-60 -mt-2 mb-4">The single most important architectural decision in the editor</div>

All canvas state — strokes, pages, text boxes, zoom, history — flows through **one reducer**, updated only by dispatched actions.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **One source of truth.** ~20 interrelated state fields stay consistent because every change goes through one function.
- **Predictable updates.** State only changes via typed actions, so behaviour is traceable and debuggable.
- **Undo/redo falls out naturally.** Centralised state makes snapshot history trivial vs. scattered `useState`.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-click>

- More upfront ceremony than `useState`: actions, types, and a reducer to wire up.

</v-click>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

Redux solves the same problem but adds stores, middleware, and boilerplate. At this size that complexity buys nothing — `useReducer` is built into React, has zero dependencies, and already scales to every feature here.

</v-click>
</div>
</div>

<!--
Lead with the headline decision. Stress: ~20 fields that must stay in sync.
The Redux comparison is the key talking point — right tool, right scale.
-->

---

# 01 · `useReducer` — the shape of it

State, actions, and the reducer are unified behind one hook:

```ts {all|2|3-4|7}
export function useCanvasReducer(): [
  CanvasState,                                  // ~20 fields, one object
  React.ActionDispatch<[action: CanvasAction]>, // every change is an action
] {
  return React.useReducer(canvasReducer, initialState);
}
// Components never call setState — they dispatch({ type: "POINTER_UP", ... })
```

<div class="mt-4 text-sm opacity-70">
Adding a feature means adding an action + a case — the wiring pattern never changes.
</div>

<!--
Point out: components don't manage state, they describe intent via actions.
The 2-line public surface hides ~20 fields of coordinated state.
-->

---
layout: default
---

# 02 · Feature-split pure reducers

<div class="opacity-60 -mt-2 mb-4">The reducer routes; the logic lives in small focused files</div>

Instead of one 500-line `switch`, each action type delegates to its own pure function, grouped by feature folder.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Readable at a glance.** The root reducer is a table of contents; details live in named files.
- **Low merge friction.** Drawing logic and textbox logic live in different files, so changes rarely collide.
- **Independently testable.** Each `reducerHandle*` is a pure `(state, action) => state` function.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- More files and import lines to navigate.
- Shared helpers (e.g. history slicing) must be deliberately factored out, not copy-pasted.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

File count is cheap; a 500-line `switch` is not. The folder names *are* the documentation, and the editor jumps to definitions instantly — so "more files" costs nothing in practice.

</v-click>
</div>
</div>

<!--
Contrast with the common anti-pattern: one giant reducer that everyone edits and nobody understands.
-->

---

# 02 · Routing, not implementing

The root reducer stays a thin dispatch table:

````md magic-move {lines: true}
```ts
// A monolithic reducer inlines every transition...
function canvasReducer(state, action) {
  switch (action.type) {
    case "POINTER_UP": {
      const newPathData = { path: action.payload.pathData, color: state.pen.color };
      const updatedState = state.states.slice(0, state.historyIndex + 1);
      const currentPage = updatedState[state.historyIndex][action.payload.activePageIndex];
      const updatedPage = { svgData: [...currentPage.svgData, newPathData], /* ... */ };
      // ...30 more lines, repeated for every action...
    }
  }
}
```

```ts
// ...the split version routes to one focused, pure function per action.
function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case "POINTER_DOWN":  return reducerHandleDrawingPointerDown(state, action);
    case "POINTER_MOVE":  return reducerHandleDrawingPointerMove(state, action);
    case "POINTER_UP":    return reducerHandleDrawingPointerUp(state, action);
    case "ADD_PAGE":      return reducerHandleAddPage(state);
    case "ADD_TEXTBOX":   return reducerHandleAddTextbox(state, action);
    case "ZOOM_POINTER_MOVE": return reducerHandleZoomPointerMove(state, action);
    // ...one clear line per behaviour
  }
}
```
````

<!--
The magic-move animation is the point here: watch the giant case collapse into a single readable line.
-->

---
layout: default
---

# 03 · Immutable undo/redo history model

<div class="opacity-60 -mt-2 mb-4">History as an array of snapshots + a pointer, never mutated in place</div>

`states` is an array of notebook snapshots; `historyIndex` points at the current one. Edits append a *new* snapshot.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Undo/redo is just moving the index** — no inverse operations to implement.
- **Correct branching.** Editing after an undo discards the stale "future" via one slice.
- **Immutability prevents whole bug classes** — past snapshots can never be silently corrupted.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- Each snapshot copies the notebook → memory grows with history length.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

Notebooks are lightweight (SVG path strings + text), and history is naturally bounded by a session. A command/diff-based undo system would be far more complex for memory savings nobody needs yet — and could be added later without changing callers.

</v-click>
</div>
</div>

<!--
Key insight: undo becomes historyIndex--. Redo becomes historyIndex++. That's it.
The slice pattern is what makes branching correct.
-->

---

# 03 · Append a snapshot, advance the index

Every mutating action follows the **same** branch-safe pattern:

```ts {all|2|4-8|10-12}{lines:true}
// reducer/drawing-pointer.ts — on stroke commit
const updatedState = state.states.slice(0, state.historyIndex + 1); // drop stale redo branch

const currentPage = updatedState[state.historyIndex][action.payload.activePageIndex];
const updatedPage: Page = {
  svgData: [...currentPage.svgData, newPathData],
  textBoxes: [...currentPage.textBoxes],
};
const updatedNotebook: Notebook = deepCopy(updatedState[state.historyIndex]);
updatedNotebook[action.payload.activePageIndex] = updatedPage;

return { ...state, states: [...updatedState, updatedNotebook], historyIndex: state.historyIndex + 1 };
```

```ts
// reducer/history.ts — undo & redo are pure index moves
reducerHandleUndo: historyIndex > 0            ? historyIndex - 1 : historyIndex
reducerHandleRedo: historyIndex < len - 1      ? historyIndex + 1 : historyIndex
```

<!--
slice(0, historyIndex + 1) is the linchpin — forget the +1 upper bound and undo branching breaks.
That exact bug is documented in the codebase.
-->

---
layout: default
---

# 04 · Context API for state distribution

<div class="opacity-60 -mt-2 mb-4">One provider, consumed anywhere — no prop drilling</div>

`CanvasContext` exposes `{ state, dispatch, handlers }`. Deeply-nested components (a textbox, a resize handle) read it directly.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **No prop drilling** through `Editor → Page → Textbox → DragHandle`.
- **Decoupled components.** A handle deep in the tree needs zero intermediate plumbing.
- **Built into React** — no extra dependency, pairs perfectly with the reducer.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- A context update can re-render all consumers.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

The consumer tree is small (one editor surface), so re-render cost is negligible. If a hot path ever shows up, it can be split into multiple contexts or memoised — without touching the components that consume it today.

</v-click>
</div>
</div>

<!--
The drag handle three levels deep is the perfect example of what prop-drilling would have cost.
-->

---

# 04 · A guarded, typed context

State and the dispatcher are composed once and shared:

```ts {all|2-3|10-12|16-21}
export function useCanvasStateVars(): CanvasContextValue {
  const [state, dispatch] = useCanvasReducer();
  const pointerHandlers = usePointerHandlers(state, dispatch);
  return { state, dispatch, handlers: { pointer: pointerHandlers } };
}

export function useCanvasContext(): CanvasContextValue {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvasContext must be used within CanvasContext.Provider");
  }
  return context;
}
```

```tsx
// Any descendant, no props passed down:
const { state, dispatch } = useCanvasContext();
```

<!--
Note the two-hook split: useCanvasStateVars builds the value at the provider, useCanvasContext consumes it safely.
-->

---
layout: default
---

# 05 · Pure reducers vs. DOM event adapters

<div class="opacity-60 -mt-2 mb-4">Keep side-effecting DOM code out of the pure state logic</div>

A thin **handler** layer translates raw `PointerEvent`s into clean actions. Reducers never touch the DOM (with one documented exception).

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Reducers stay pure** → easy to reason about and test in isolation.
- **Coordinate math & gesture guards** live in one place, out of `Page.tsx`.
- **Swappable input.** The event source could change without rewriting state logic.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- An extra hop: event → handler → action → reducer.
- One reducer (`DRAG_TEXTBOX_POINTER_MOVE`) still reads the DOM, breaking the rule.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

The indirection is a few lines and buys testable, predictable reducers. The single impure case is explicitly documented as the exception — so the rule still holds where it matters most.

</v-click>
</div>
</div>

<!--
Honesty point: acknowledge the one impure reducer. It's documented, which is the maintainable way to handle a pragmatic exception.
-->

---

# 05 · The adapter boundary

The handler does the DOM/coordinate work, then dispatches a clean action:

```ts {all|2-3|5|7-10}
const handlePointerDown = (e: PointerEvent, activePageIndex: number): void => {
  if (state.gestureTarget === "pending" || state.gestureTarget === "zoom") return;
  if (state.isDrawing) return;

  const xy = svgCoordsFromPointerEvent(e);          // messy DOM/CTM math here...
  if (!xy) return;
  dispatch({                                         // ...clean action out
    type: "POINTER_DOWN",
    payload: { points: [[xy[0], xy[1], e.pressure]], activePageIndex },
  });
};
```

<div class="mt-3 text-sm opacity-70">
The reducer that receives this only sees numbers — never an <code>Element</code> or a <code>clientX</code>.
</div>

<!--
The reducer downstream is a pure (state, action) => state. All the browser messiness is quarantined here.
-->

---
layout: default
---

# 06 · Type-safe discriminated-union actions

<div class="opacity-60 -mt-2 mb-4">Every action's payload is checked at compile time</div>

`CanvasAction` is a discriminated union on `type`. An `ActionOf<T>` helper gives each reducer its exact payload type.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Impossible to dispatch a malformed action** — wrong payload won't compile.
- **Exhaustiveness checking** flags any action type the reducer forgot to handle.
- **Autocomplete everywhere** — the editor knows each action's exact payload.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- The union and `ActionOf` types are verbose to maintain.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

The verbosity is a one-time cost that pays back on every dispatch and every refactor. The compiler becomes a safety net: rename or remove an action and it tells you every place that breaks.

</v-click>
</div>
</div>

<!--
This is TypeScript doing real work — not types-as-decoration. The exhaustiveness rule is enforced by ESLint too.
-->

---

# 06 · One source of action truth

```ts {all|1-8|10-13}
export type CanvasAction =
  | { type: "POINTER_DOWN";  payload: { points: Point[]; activePageIndex: number } }
  | { type: "POINTER_UP";    payload: { pathData: string; activePageIndex: number } }
  | { type: "SET_PEN_SIZE";  payload: number }
  | { type: "ADD_PAGE" }
  | { type: "UNDO" }
  | { type: "REDO" };
  // ...one entry per behaviour, payload included

// Each reducer asks for *exactly* the action it handles:
export type ActionOf<TType extends CanvasAction["type"]> =
  Extract<CanvasAction, { type: TType }>;

function reducerHandleDrawingPointerUp(state: CanvasState, action: ActionOf<"POINTER_UP">) { /* ... */ }
```

<div class="mt-3 text-sm opacity-70">
ESLint's <code>switch-exhaustiveness-check</code> turns "forgot a case" into a build error.
</div>

<!--
ActionOf<"POINTER_UP"> means the reducer literally cannot receive the wrong payload.
-->

---
layout: section
---

# Tier 2
## Input & Interaction

<div class="opacity-60 mt-2">Taming touch, pen, mouse, and zoom</div>

---
layout: default
---

# 07 · Gesture state machine (`gestureTarget`)

<div class="opacity-60 -mt-2 mb-4">A four-state machine decides: draw, zoom, or wait?</div>

`gestureTarget: "idle" | "pending" | "zoom" | "draw"` coordinates ambiguous touch input. A 20 ms `"pending"` window waits to see if a second finger lands.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Resolves "draw vs. pinch" cleanly** — one finger draws, two fingers zoom, decided deterministically.
- **Explicit states beat scattered booleans** — no tangle of `isZooming && !isDrawing` checks.
- **Central guard.** Drawing handlers simply refuse to run unless the state allows it.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- A 20 ms delay before a single-finger stroke begins.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

20 ms is below the threshold of human perception — the stroke feels instant. That tiny wait is what makes pinch-zoom and drawing coexist without misfires, which is essential on a touch-first notes app.

</v-click>
</div>
</div>

<!--
A finite state machine is the textbook fix for "which gesture is this?" ambiguity. The 20ms window is the clever bit.
-->

---

# 07 · The 20 ms decision window

```ts {all|2-3|5-7|9-11}
// PaginatedNotesEditor.tsx — first touch starts a "pending" gesture
useEffect(() => {
  if (gestureTarget !== "pending" || zoomPointerEvents.size !== 1) return;

  const id = window.setTimeout(() => {
    dispatch({ type: "RESOLVE_PENDING_GESTURE" }); // still one finger? → draw
  }, 20);

  return () => window.clearTimeout(id); // a 2nd finger arrived first → pinch wins
}, [gestureTarget, zoomPointerEvents.size, dispatch]);
```

<div class="grid grid-cols-4 gap-2 mt-5 text-center text-xs">
  <div class="p-2 rounded border border-gray-500/30">idle</div>
  <div class="p-2 rounded border border-amber-500/40 bg-amber-500/10">pending<div class="opacity-50">20ms</div></div>
  <div class="p-2 rounded border border-sky-500/40 bg-sky-500/10">zoom</div>
  <div class="p-2 rounded border border-green-500/40 bg-green-500/10">draw</div>
</div>

<!--
If the cleanup fires (second finger), we never reach draw. Otherwise the timeout commits to drawing.
-->

---
layout: default
---

# 08 · Unified Pointer Events API

<div class="opacity-60 -mt-2 mb-4">One code path for mouse, pen, and touch</div>

The editor listens to `PointerEvent`s, not separate `mouse*` and `touch*` events. Pressure, pointer type, and capture come for free.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **One handler covers all input devices** — no duplicated mouse/touch logic.
- **`e.pressure` out of the box** feeds straight into variable-width ink.
- **Pointer capture** keeps a stroke attached even if the finger slips off the page.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- Touch quirks (e.g. `buttons` not set the same as mouse) need special-casing.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

A handful of documented touch checks is far less code than maintaining parallel mouse and touch pipelines. Pointer Events are supported across all target platforms, so there's no compatibility cost.

</v-click>
</div>
</div>

<!--
The alternative — separate mouse and touch listeners — doubles the surface area and the bugs.
-->

---

# 08 · One handler, every device

```ts {all|2-6|8|10-13}
const handlePointerMove = (e: PointerEvent, activePageIndex: number): void => {
  if (e.pointerType === "pen" || e.pointerType === "mouse" || e.pointerType === "touch") {
    const touchStrokeAfterResolve =
      e.pointerType === "touch" && state.gestureTarget === "draw" && state.isDrawing;
    // touch may not report buttons === 1, so allow the resolved-touch case
    if (!touchStrokeAfterResolve && e.buttons !== 1) return;

    const xy = svgCoordsFromPointerEvent(e);
    if (!xy) return;
    const newPoints = [...state.points, [xy[0], xy[1], e.pressure]]; // pressure → ink width
    dispatch({ type: "POINTER_MOVE", payload: { points: newPoints, activePageIndex } });
  }
};
```

<!--
e.pressure is the payoff: free pressure-sensitivity for pen input with zero extra plumbing.
-->

---
layout: default
---

# 09 · Centralised coordinate-transform utilities

<div class="opacity-60 -mt-2 mb-4">One module owns all the screen ↔ canvas math</div>

`zoom-utils.ts` converts between screen, SVG user space, and wrapper-local coordinates using the browser's own CTM — so points stay correct under pan + zoom.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **DRY.** Every feature (ink, textbox, image) reuses the same transforms.
- **Correct under zoom/pan** by construction — the matrix handles the hard part.
- **Single place to fix** if the coordinate model ever changes.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- Relies on `getScreenCTM()` and specific DOM ids being present.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

Using the browser's native matrix is more reliable than hand-rolled offset math, which silently breaks under nested transforms. The DOM-id coupling is documented and centralised — far safer than the same math copy-pasted across five components.

</v-click>
</div>
</div>

<!--
Coordinate math is where canvas apps quietly rot. Centralising it is a long-term maintainability bet.
-->

---

# 09 · Let the browser do the matrix math

```ts {all|2-3|4-6|8}
export function clientToSvgUserPoint(svg: SVGSVGElement, clientX: number, clientY: number): DOMPoint | null {
  const ctm = svg.getScreenCTM();        // current transform incl. ancestor scale
  if (!ctm) return null;
  const inv = ctm.inverse();             // invert: screen → user space
  const pt = svg.createSVGPoint();
  pt.x = clientX; pt.y = clientY;
  return pt.matrixTransform(inv);        // one transform handles pan + zoom together
}
```

<div class="mt-4 text-sm opacity-70">
Reused by ink seeding, textbox placement, drag deltas, and pinch focal tracking.
</div>

<!--
No manual "subtract offset, divide by scale" — the CTM already encodes all of it.
-->

---
layout: section
---

# Tier 3
## Build-vs-Buy & Rendering

<div class="opacity-60 mt-2">Knowing what *not* to build</div>

---
layout: default
---

# 10 · BlockNote for rich text

<div class="opacity-60 -mt-2 mb-4">Don't reinvent a rich-text editor</div>

Text boxes embed **BlockNote** — a batteries-included block editor — instead of a hand-built `contentEditable` surface.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Rich editing for free** — formatting, lists, keyboard handling, IME, accessibility.
- **Structured JSON output** (`PartialBlock[]`) slots straight into the reducer's history.
- **Massive scope saved.** Rich text editing is a multi-year problem on its own.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- A heavy third-party dependency with its own data model and styling.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

Building a correct rich-text editor is one of the hardest problems in frontend. The dependency's weight is trivial next to the months it saves, and BlockNote's JSON model integrates cleanly with the existing snapshot history.

</v-click>
</div>
</div>

<!--
The classic build-vs-buy call. contentEditable is a famous tar pit; buying here is obviously correct.
-->

---

# 10 · Editor in, JSON out

```tsx {all|1|3-5|7-8}
const editor = useCreateBlockNote({ initialContent: textboxData.textData }, [userHasUndoneOrRedone]);

// the editor's document is plain JSON we can store in history
const handleEditorOnChange = () =>
  dispatch({ type: "UPDATE_TEXTBOX", payload: { /* ... */ newTextBoxData: editor.document } });

// remount on undo/redo so content matches the active snapshot
// (dependency array includes userHasUndoneOrRedone)
```

<div class="mt-4 text-sm opacity-70">
The editor's <code>document</code> is just data — so undo/redo and persistence treat it like any other state.
</div>

<!--
Tie it back to Tier 1: BlockNote output is "just data", so it rides the same history machinery.
-->

---
layout: default
---

# 11 · `perfect-freehand` for ink

<div class="opacity-60 -mt-2 mb-4">Pressure-sensitive strokes without the geometry headache</div>

Raw input points go to `perfect-freehand`, which returns a smooth, variable-width stroke outline — turned into an SVG path.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Natural-looking ink** with pressure, smoothing, and tapering solved for us.
- **Tiny, focused library** — does one thing, no framework lock-in.
- **Tunable** via a single options object (size, thinning, streamline).

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- Less direct control over the exact stroke-rendering algorithm.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

The math behind good pressure-based ink (offset curves, smoothing) is genuinely hard to get right. The options object exposes every knob the app realistically needs, so giving up the low-level algorithm costs nothing today.

</v-click>
</div>
</div>

<!--
Another build-vs-buy. The stroke geometry is the kind of thing that looks easy and absolutely is not.
-->

---

# 11 · Points → outline → SVG path

```ts {all|1|3-9|11-12}
import getStroke from "perfect-freehand";

const options = {
  size: pen.size,
  thinning: 0.5,     // how much pressure affects width
  smoothing: 0.01,
  streamline: 0.5,
  start: { cap: true }, end: { cap: true },
};

const stroke = getStroke(points, options);       // [x,y,pressure][] → outline polygon
const pathData = getSvgPathFromStroke(stroke);    // outline → SVG "d" string
```

<div class="mt-4 text-sm opacity-70">
Input is the same <code>[x, y, pressure]</code> points captured by the Pointer Events handler (Decision 08).
</div>

<!--
Notice the pipeline: pointer pressure (08) feeds freehand (11) feeds SVG (12). The decisions compose.
-->

---
layout: default
---

# 12 · SVG (declarative) for stroke rendering

<div class="opacity-60 -mt-2 mb-4">Vector paths in the DOM, not an imperative canvas</div>

Each page is an `<svg>`; committed strokes are `<path>` elements rendered declaratively from state by React.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Resolution-independent** — strokes stay crisp at any zoom level.
- **Declarative.** React renders paths straight from state; no manual redraw loop.
- **Inspectable & stylable** — each stroke is a real DOM node with its own colour.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- Thousands of `<path>` nodes could strain the DOM on very dense pages.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

For A4 note pages, realistic stroke counts are nowhere near that limit. The declarative model removes an entire class of "forgot to redraw" canvas bugs, and SVG can be swapped for canvas on a per-page basis later if density ever demands it.

</v-click>
</div>
</div>

<!--
SVG vs canvas is a real tradeoff; for note-taking, crispness + declarative simplicity win at this scale.
-->

---

# 12 · State renders itself

```tsx {all|1|2-4|7-8}
<svg className="svg-canvas" data-page-index={`${pageIndex}`}>
  {pageData.svgData.map((pd, index) => (              // committed strokes
    <path key={index} d={pd.path} fill={pd.color} />
  ))}

  {pageIndex === state.activePageIndex && (            // live in-progress stroke
    <path d={pathData} />
  )}
</svg>
```

<div class="mt-4 text-sm opacity-70">
No <code>ctx.beginPath()</code>, no redraw loop — change the state, the picture follows.
</div>

<!--
The committed-vs-live split: stored paths from history, plus one live path for the current stroke.
-->

---
layout: section
---

# Tier 4
## Structure & Maintainability

<div class="opacity-60 mt-2">The choices that keep it pleasant to work in</div>

---
layout: default
---

# 13 · Custom hooks for interaction logic

<div class="opacity-60 -mt-2 mb-4">Behaviour lives in hooks; components stay declarative</div>

Drag, resize, and edit behaviours are extracted into hooks (`useTextboxDrag`, `useImageDrag`, `useImageAdjustWidth`…). Components just wire handlers to elements.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Clean separation** — JSX describes structure, hooks own behaviour.
- **Reusable pattern.** The same drag lifecycle is shared across image edges and corners.
- **Testable & focused.** Each hook has one clear responsibility.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- More small files; behaviour is one indirection away from the markup.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

A component that mixed JSX with pointer math would be hard to read and impossible to reuse. The indirection is shallow and consistent, so once you know the pattern, every interaction reads the same way.

</v-click>
</div>
</div>

<!--
This is React's idiomatic "logic in hooks, view in components" split, applied consistently.
-->

---

# 13 · The component just wires it up

```tsx {all|1-8|10-14}
const {
  isDragging,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handlePointerCancel,
  handleEditorOnChange,
} = useTextboxDrag({ pageIndex, textboxIndex, editor });   // all behaviour here

<div className="textbox-drag-handlebar"
  onPointerDown={handlePointerDown}                        // markup just binds it
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  onPointerCancel={handlePointerCancel} />
```

<!--
The component reads like a description of the UI. None of the drag math leaks into the JSX.
-->

---
layout: default
---

# 14 · Scoped local context for prototypes

<div class="opacity-60 -mt-2 mb-4">Experimental features don't pollute the core state model</div>

The in-progress image feature keeps its bounds/selection in a separate `ImageContext` — deliberately *not* in `CanvasState` history yet.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Core state stays clean** — unfinished features don't bloat the canonical model.
- **Fast iteration.** The prototype evolves without touching reducers or history.
- **Clear boundary** between "shipped & persisted" and "experimental".

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- Image state isn't in undo/redo, and there are two state systems to understand.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

A prototype shouldn't pay the full integration tax before its design is settled. Keeping it isolated means it can be promoted into `CanvasState` later — deliberately — rather than entangling the history model with a half-formed feature now.

</v-click>
</div>
</div>

<!--
A maturity decision: isolate the experiment, integrate it on purpose once it's proven.
-->

---
layout: default
---

# 15 · `deepCopy` on history branching

<div class="opacity-60 -mt-2 mb-4">Snapshots must never share references</div>

When a new history snapshot is created, the notebook is deep-cloned so nested `textBoxes` / `svgData` don't alias across history indices.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Guarantees true immutability** — editing "now" can't mutate a past snapshot.
- **Makes undo/redo trustworthy** — each frame is fully independent.
- **One shared helper** used everywhere a snapshot is branched.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- A full recursive clone on every committing edit costs some CPU/memory.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

The alternative — accidental reference sharing — is one of the nastiest, hardest-to-trace bug classes in stateful apps. Notebook payloads are small, so the clone is cheap insurance against silent history corruption.

</v-click>
</div>
</div>

<!--
This underwrites Decision 03. Without deepCopy, the immutable history model only looks immutable.
-->

---
layout: default
---

# 16 · Strict TypeScript + ESLint tooling

<div class="opacity-60 -mt-2 mb-4">Let the toolchain catch mistakes before they ship</div>

`strict` TypeScript plus type-checked ESLint rules enforce explicit return types, ban `any`, and require exhaustive switches.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Whole bug classes vanish** — nulls, missing returns, non-exhaustive switches.
- **Self-documenting** — explicit return types make every function's contract clear.
- **Consistency by default** — the linter enforces it so reviews don't have to.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- More friction while writing — the compiler says "no" more often.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

Every "no" at compile time is a bug that never reached runtime. On a long-lived codebase that friction is a feature: it keeps quality from eroding as the project grows.

</v-click>
</div>
</div>

<!--
This is the "future me" decision — strictness is an investment in maintainability, not red tape.
-->

---

# 16 · The rules that hold the line

```ts {all|2|3|4|5}
rules: {
  "@typescript-eslint/explicit-function-return-type": "error",  // contracts are explicit
  "@typescript-eslint/no-explicit-any": "error",                // no escape hatches
  "@typescript-eslint/strict-boolean-expressions": "error",     // no truthy footguns
  "@typescript-eslint/switch-exhaustiveness-check": "error",    // handle every action
}
```

```json
// tsconfig.json
{ "strict": true, "noImplicitReturns": true,
  "noUnusedLocals": true, "noFallthroughCasesInSwitch": true }
```

<div class="mt-3 text-sm opacity-70">
<code>switch-exhaustiveness-check</code> is what makes the reducer (Decision 06) provably complete.
</div>

<!--
Connect back to Decision 06: the typed action union + this rule together guarantee no action is forgotten.
-->

---
layout: default
---

# 17 · Co-located README docs per folder

<div class="opacity-60 -mt-2 mb-4">The documentation lives next to the code it describes</div>

Nearly every significant folder has a `README.md` describing its purpose, structure, and the non-obvious nuances that bite later.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Context where you need it** — open a folder, read why it exists.
- **Captures the *nuances*** — the 20 ms window, the slice `+1`, the impure reducer.
- **Survives better than wiki docs** — it's versioned with the code and reviewed in PRs.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- Docs can drift out of date if not maintained alongside changes.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

Being co-located and in version control makes drift visible in review — far better than a forgotten external wiki. The captured "gotchas" alone save hours of re-discovering hard-won knowledge.

</v-click>
</div>
</div>

<!--
These very READMEs are why this presentation could be written quickly — they encode the *why*.
-->

---
layout: two-cols
layoutClass: gap-8
---

# 18 · Feature-based folder structure

<div class="opacity-60 mt-1 mb-3 text-sm">Group by feature, co-locate everything it needs</div>

Each feature folder holds its component, hooks, CSS, and README together — not split across global `components/`, `hooks/`, `styles/` trees.

<div class="text-green-400 font-bold mb-1 text-sm">Why it's good</div>
<div class="text-sm">

- **High cohesion** — everything for a feature is in one place.
- **Easy to find & delete** — a feature is a folder.
- **Scales by addition**, not by growing shared buckets.

</div>

<div class="text-amber-400 font-bold mb-1 mt-3 text-sm">The tradeoff</div>
<div class="text-sm">

- Deep nesting; truly shared code needs a deliberate home.

</div>

<div class="text-sky-400 font-bold mb-1 mt-3 text-sm">Why it's worth it</div>
<div class="text-sm">

Depth is a navigation cost the editor erases; tangled shared folders are a comprehension cost that compounds forever.

</div>

::right::

```text {all|2-5|6-10}
paginated-notes/
├─ Page.tsx
├─ image/
│  ├─ Image.tsx
│  ├─ useImageDrag.ts
│  └─ image-size-draggers/
├─ textbox/
│  ├─ Textbox.tsx
│  ├─ useTextboxDrag.ts
│  └─ textbox.css
└─ state-management/
   ├─ useCanvasReducer.ts
   └─ reducer/
      ├─ drawing-pointer.ts
      ├─ history.ts
      └─ textboxes/
```

<!--
The tree itself communicates the architecture. Each folder is a self-contained unit of meaning.
-->

---
layout: default
---

# 19 · Provider-guard context hooks

<div class="opacity-60 -mt-2 mb-4">Fail loudly and early when used wrong</div>

`useCanvasContext` / `useImageContext` throw a clear error if called outside their provider, instead of returning `undefined`.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Fail-fast** — a misplaced component errors immediately with a clear message.
- **Narrows the type** — consumers get a defined value, no `undefined` checks.
- **Self-documenting contract** — the error states exactly how to use the hook.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- A few lines of boilerplate repeated in each context hook.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

Those few lines convert a confusing "cannot read property of undefined" crash deep in render into an instant, descriptive error at the source — and they remove `undefined` from every call site's type.

</v-click>
</div>
</div>

<div class="mt-4">

```ts
if (!context) throw new Error("useCanvasContext must be used within CanvasContext.Provider");
return context; // now typed as defined — every consumer benefits
```

</div>

<!--
Cheap defensive code with an outsized payoff in developer experience and type safety.
-->

---
layout: default
---

# 20 · Intention-revealing names & constants

<div class="opacity-60 -mt-2 mb-4">The smallest decision, made consistently everywhere</div>

Functions say what they do (`reducerHandleDrawingPointerUp`), magic numbers become named constants (`A4_PAGE_72PPI_W`), and DOM hooks are explicit `data-*` attributes.

<div class="grid grid-cols-2 gap-5 mt-2 text-sm">
<div>
<div class="text-green-400 font-bold mb-1">Why it's good</div>
<v-clicks>

- **Reads like prose** — `reducerHandleResolvePendingGesture` needs no comment.
- **No mystery numbers** — `595×842` becomes `A4_PAGE_72PPI_W/H`.
- **Stable DOM contracts** — `data-page-index` is searchable and intentional.

</v-clicks>
</div>
<div>
<div class="text-amber-400 font-bold mb-1">The tradeoff</div>
<v-clicks>

- Long, verbose identifiers throughout the codebase.

</v-clicks>
<div class="text-sky-400 font-bold mb-1 mt-3">Why it's worth it</div>
<v-click>

Code is read far more than it's written. Verbosity that removes ambiguity is a bargain — and autocomplete means the length is never actually typed by hand.

</v-click>
</div>
</div>

```ts
export const A4_PAGE_72PPI_W = 595;   // not a magic 595 scattered across files
export const A4_PAGE_72PPI_H = 842;
```

<!--
Small but pervasive. Good names are the cheapest documentation that never goes stale.
-->

---
layout: center
class: text-center
---

# Recap

<div class="grid grid-cols-2 gap-x-12 gap-y-1 mt-6 text-left text-sm max-w-3xl mx-auto opacity-90">
<div>One reducer is the single source of truth</div>
<div>Logic split into pure, testable functions</div>
<div>Immutable snapshots make undo/redo trivial</div>
<div>Context removes prop drilling</div>
<div>Pure reducers, adapters handle the DOM</div>
<div>Types make bad actions impossible</div>
<div>A state machine tames touch gestures</div>
<div>Buy hard problems (text, ink), build the rest</div>
<div>SVG keeps rendering declarative & crisp</div>
<div>Strict tooling & co-located docs keep it healthy</div>
</div>

<div class="mt-10 text-lg">
Every decision favours <span class="text-sky-400">clarity and the right complexity for the stage</span> —
deferring cost until it's actually justified.
</div>

<div class="abs-br m-6 opacity-50 text-sm">Thank you · questions welcome</div>

<!--
Close by restating the through-line: each choice matches complexity to the project's current needs,
and leaves a clear upgrade path for when needs change.
-->

<style>
.slidev-layout h1 {
  font-weight: 600;
}
.slidev-layout h1 + p {
  opacity: 0.7;
}
</style>
