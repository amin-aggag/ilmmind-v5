import { ReactNode } from "react"
import "./EditorButton.css"

interface EditorUIButtonProps {
  children?: ReactNode,
  onClick?: () => void,
  selected?: boolean,
  isDisabled?: boolean
}

export const EditorUIButton = ({
  children,
  onClick,
  selected,
  isDisabled = false
}: EditorUIButtonProps) => {
    return (
        <button className={`editor-button ${selected && "drop-shadow"} ${isDisabled && "opacity-50"} ${!isDisabled && "cursor-pointer"}`}
        disabled={isDisabled}
        onClick={onClick}>
            {children}
        </button>
    )
}