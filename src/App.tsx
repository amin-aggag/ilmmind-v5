import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { PersistenceContext } from "./hooks/use-persistence-context";
import NoteEditor from "./components/note-editor/NoteEditor";
import AppUI from "./components/app-ui/AppUI";

function App() {
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <>
      {/* <NoteEditor /> */}
      <AppUI />
    </>
  );
}

export default App;
