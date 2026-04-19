import React, { useEffect } from "react";
import "./Sidebar.css";

const MIN_SIDEBAR_WIDTH_PX = 200;
const MAX_SIDEBAR_WIDTH_PX = 400;

export default function Sidebar() {
  const [isResizing, setIsResizing] = React.useState<boolean>(false);
  const [width, setWidth] = React.useState<number>(200);

  const sidebarDraggerRef = React.useRef<HTMLDivElement>(null);

  const adjustSidebarWidth = (e: MouseEvent) => {
    if (
      e.clientX >= MIN_SIDEBAR_WIDTH_PX &&
      e.clientX <= MAX_SIDEBAR_WIDTH_PX
    ) {
      setWidth(e.clientX);
    }
  };

  const setIsResizingOff = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      sidebarDraggerRef.current?.classList.add("is-dragging");
      document.getElementById("root")!.style.cursor = "col-resize";

      document.addEventListener("mousemove", adjustSidebarWidth);
      document.addEventListener("mouseup", setIsResizingOff);

      return () => {
        document.removeEventListener("mousemove", adjustSidebarWidth);
        document.removeEventListener("mouseup", setIsResizingOff);
      };
    } else {
      sidebarDraggerRef.current?.classList.remove("is-dragging");
      document.getElementById("root")!.style.cursor = "";
    }
  }, [isResizing]);

  return (
    <div className="sidebar" style={{ width: `${width}px` }}>
      <div className="sidebar-content">test</div>
      <div
        className="sidebar-width-dragger"
        onMouseDown={() => setIsResizing(true)}
        ref={sidebarDraggerRef}
      ></div>
    </div>
  );
}
