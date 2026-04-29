import PaginatedNotesEditor from "./components/note-editor/paginated-notes/PageNotesEditor";
import "./App.css";
import Sidebar from "./components/app-navigation/sidebar/Sidebar";

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <PaginatedNotesEditor />
    </div>
  );
}
