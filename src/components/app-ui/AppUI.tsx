import SVGCanvas from '../note-editor/page-notes/PageNotesEditor'
import './appUI.css'
import Sidebar from './sidebar/Sidebar'

export default function AppUI() {
    return (
        <div className="app-ui">
            <Sidebar/>
            <div>
                <SVGCanvas/>
            </div>
        </div>
    )
}