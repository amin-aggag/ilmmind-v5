import React from "react";
import { invoke } from "@tauri-apps/api/core";

export const PersistenceContext = React.createContext<unknown | null>(null);

export const usePersistanceContextVars = () => {
    const load = () => {
        
    }
}