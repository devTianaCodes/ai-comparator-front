import { BrowserRouter, Route, Routes } from "react-router-dom";
import ModelDetail from "./pages/ModelDetail";
import ModelList from "./pages/ModelList";
import "./App.css";


function App() {


  return (
    <BrowserRouter>
      <main className="page">
        <h1>AI Comparator</h1>

        {/* Day 4: BrowserRouter handles the list page and the real detail page. */}
        <Routes>
          <Route path="/" element={<ModelList />} />
          <Route path="/models/:id" element={<ModelDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
