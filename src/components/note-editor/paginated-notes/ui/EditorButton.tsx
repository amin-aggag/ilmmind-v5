import React, { MouseEventHandler, ReactNode } from "react";
import "./EditorButton.css";

interface EditorUIButtonProps {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
  isDisabled?: boolean;
}

export const EditorUIButton = ({
  children,
  onClick,
  selected,
  isDisabled = false,
}: EditorUIButtonProps): React.ReactNode => {
  const selectedClass = selected === true && "selected";
  const isDisabledClass = isDisabled === true && "opacity-50";
  const isNotDisabledClass = !isDisabled === true && "cursor-pointer";

  const buttonClassName = `editor-button ${selectedClass} ${isDisabledClass} ${isNotDisabledClass}`;

  return (
    <button className={buttonClassName} disabled={isDisabled} onClick={onClick}>
      {children}
    </button>
  );
};
