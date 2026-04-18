import React, { useEffect } from "react";

export default function Sidebar() {
  const [isResizing, setIsResizing] = React.useState<boolean>(false);
  const [width, setWidth] = React.useState<number>(200);

  const sidebarRef = React.useRef<HTMLDivElement>(null);

  const adjustSidebarWidth = (e: MouseEvent) => {
    setWidth(e.clientX);
  };

  useEffect(() => {
    if (isResizing) {
      sidebarRef.current?.addEventListener("mousemove", adjustSidebarWidth);

      return () =>
        sidebarRef.current?.removeEventListener(
          "mousemove",
          adjustSidebarWidth,
        );
    }
  }, [sidebarRef, isResizing]);

  return (
    <div
      className="sidebar"
      ref={sidebarRef}
      onMouseDown={() => setIsResizing(true)}
      onMouseUp={() => setIsResizing(false)}
      style={{width: `${width}px`}}
    >
      test
    </div>
  );
}
