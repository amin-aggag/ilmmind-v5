import type { NoteEditorProps } from "../NoteEditor"

type CanvasNotesEditorProps = Omit<NoteEditorProps, "layout">;

export default function CanvasNotesEditor({ ...props }: CanvasNotesEditorProps) {
    return (
        <div>
            CanvasNotesEditor
        </div>
    )
}