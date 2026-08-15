import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import HomePage from "./pages/HomePage";
import AskPage from "./pages/AskPage";
import KnowledgePage from "./pages/KnowledgePage";
import KnowledgeDetailPage from "./pages/KnowledgeDetailPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left sidebar */}
          <Sidebar />

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ask" element={<AskPage />} />
              <Route path="/knowledge" element={<KnowledgePage />} />
              <Route path="/knowledge/:id" element={<KnowledgeDetailPage />} />
            </Routes>
          </main>

          {/* Right sidebar */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
