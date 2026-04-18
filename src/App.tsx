import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { PersistenceContext } from "./hooks/use-persistence-context";
import NoteEditor from "./components/note-editor/NoteEditor";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <PersistenceContext.Provider value={null}>
      <NoteEditor />
    </PersistenceContext.Provider>
  );
}

export default App;
