import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateQuest from "./pages/CreateQuest";
import PlayQuest from "./pages/PlayQuest";
import WinScreen from "./pages/WinScreen";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100">
        <h1 className="text-5xl font-bold mb-8">QR Quest</h1>

        {/* Navigation buttons */}
        <div className="flex flex-col gap-4">
          <Link
            to="/create"
            className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-500"
          >
            Create a Quest
          </Link>

          <Link
            to="/play/123"
            className="bg-green-600 px-6 py-3 rounded hover:bg-green-500"
          >
            Play a Quest
          </Link>
        </div>
      </div>

      {/* Page routes */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateQuest />} />
        <Route path="/play/:questId" element={<PlayQuest />} />
        <Route path="/win" element={<WinScreen />} />
      </Routes>
    </Router>
  );
}
