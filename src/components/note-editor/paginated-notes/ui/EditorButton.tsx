import { MouseEventHandler, ReactNode } from "react"
import "./EditorButton.css"

interface EditorUIButtonProps {
  children?: ReactNode,
  onClick?: MouseEventHandler<HTMLButtonElement>,
  selected?: boolean,
  isDisabled?: boolean
}

export const EditorUIButton = ({
  children,
  onClick,
  selected,
  isDisabled = false
}: EditorUIButtonProps) => {
    const buttonClassName = `editor-button ${selected && "selected"} ${isDisabled && "opacity-50"} ${!isDisabled && "cursor-pointer"}`;

    return (
      <button
        className={buttonClassName}
        disabled={isDisabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
}