import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import CreateQuest from "./pages/CreateQuest"
import PlayQuest from "./pages/PlayQuest"
import WinScreen from "./pages/WinScreen"
import "./index.css"
import Dashboard from "./pages/Dashboard"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create" element={<CreateQuest />} />
        <Route path="/play/:questId" element={<PlayQuest />} />
        <Route path="/win" element={<WinScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
