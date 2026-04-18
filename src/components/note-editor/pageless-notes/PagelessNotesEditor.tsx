import type { NoteEditorProps } from "../NoteEditor"

type PagelessNotesEditorProps = Omit<NoteEditorProps, "layout">;

export default function PagelessNotesEditor({ ...props }: PagelessNotesEditorProps) {
    return (
        <div>
            CanvasEditor
        </div>
    )
}