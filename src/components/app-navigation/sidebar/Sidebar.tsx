import React from "react";
import "./Sidebar.css";
import { useSidebarDrag } from "./useSidebarDrag";

export default function Sidebar() {
  const sidebarDraggerRef = React.useRef<HTMLDivElement>(null);

  const {
    isResizing,
    width,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useSidebarDrag();

  return (
    <div
      className={`sidebar ${isResizing ? "is-dragging" : ""}`}
      style={{ width: `${width}px` }}
    >
      <div className="sidebar-content">test</div>
      <div
        className="sidebar-width-dragger"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        ref={sidebarDraggerRef}
      ></div>
    </div>
  );
}
