import CanvasNotesEditor from "./canvas-notes/CanvasNotesEditor";
import { Notebook } from "./NoteTypes";
import SVGCanvas from "./page-notes/PageNotesEditor";
import PageNotesEditor from "./page-notes/PageNotesEditor";
import PagelessNotesEditor from "./pageless-notes/PagelessNotesEditor";

export type NoteEditorProps = {
    // The global ID of the note from the backend that the NoteEditor is rendering
    documentKey: string,
    // Which of the 3 types this note's type is
    layout: 'paginated' | 'pageless' | 'canvas',
    notebook: Notebook,
    // By default, each note auto saves at the frequency that is selected by the user in
    // settings. However, when set to false, auto saving is turned off for this note editor.
    autoSave: boolean,
    // A function used by the note editor that is provided by the parent that allows the note
    // editor to update its state so that the parent can show it, in for example the tab bar
    // for this note editor instance.
    saveStatus: () => void,
    // A function provided by the parent that the note editor can call so that the parent can
    // render errors in, for example, a toast or somewhere else in the UI.
    onError: () => void,
    // The note's title provided by the parent that is used when the note editor saves the note
    // into the database through the Tauri backend. When not provided, the name of the note
    // that is already in the database is used.
    noteTitle?: () => void,
}

export default function NoteEditor() {
    return (
        <>
            <SVGCanvas/>
        </>
    )
}

// export default function NoteEditor({
//     documentKey,
//     layout = "paginated",
//     notebook,
//     autoSave,
//     saveStatus,
//     onError,
//     noteTitle
// }: NoteEditorProps) {

//     switch (layout) {
//         case "paginated":
//             return <PageNotesEditor 
//                 documentKey={documentKey} autoSave={autoSave} saveStatus={saveStatus}
//                 onError={onError} noteTitle={noteTitle} notebook={notebook}
//             />
//         case "pageless":
//             return <PagelessNotesEditor
//                 documentKey={documentKey} autoSave={autoSave} saveStatus={saveStatus}
//                 onError={onError} noteTitle={noteTitle} notebook={notebook}
//             />
//         case "canvas":
//             return <CanvasNotesEditor
//                 documentKey={documentKey} autoSave={autoSave} saveStatus={saveStatus}
//                 onError={onError} noteTitle={noteTitle} notebook={notebook}
//             />
//         default:
//             throw new Error("Error: Note was not any of the 3 types.");
//     }
// }