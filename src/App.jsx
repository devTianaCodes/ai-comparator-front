import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";
import FavoritesPage from "./pages/FavoritesPage";
import ModelCompare from "./pages/ModelCompare";
import ModelDetail from "./pages/ModelDetail";
import ModelList from "./pages/ModelList";
import "./App.css";


function App() {

  return (

    <GlobalProvider>
      <BrowserRouter>

        <header className="app-header">
          <nav className="header-nav-left">
            <NavLink to="/">
              Modelli
            </NavLink>
          </nav>

          <h1>Comparatore IA</h1>

          <nav className="header-nav-right">
            <NavLink to="/favorites">
              Preferiti
            </NavLink>
          </nav>
        </header>

        <main className="page">

          <Routes>
            {/* route per la lista dei modelli */}
            <Route path="/" element={
                <ModelList />
              }
            />
              
            <Route path="/models/:id" element={
                <ModelDetail />
              }
            />

            <Route path="/favorites" element={
                <FavoritesPage />
              }
            />
            <Route path="/compare" element={<ModelCompare />} />
          </Routes>
        </main>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
