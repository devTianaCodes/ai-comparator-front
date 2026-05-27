import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import FavoritesPage from "./pages/FavoritesPage";
import ModelCompare from "./pages/ModelCompare";
import ModelDetail from "./pages/ModelDetail";
import ModelList from "./pages/ModelList";
import "./App.css";


const FAVORITE_MODELS_STORAGE_KEY = "favoriteModelIds";

function App() {

// persistenza dei preferiti: carica i preferiti salvati nel browser
  const [favoriteModelIds, setFavoriteModelIds] = useState(() => {
    const savedFavoriteIds = localStorage.getItem(FAVORITE_MODELS_STORAGE_KEY);

    try {
      if (savedFavoriteIds) {
        const parsedFavoriteIds = JSON.parse(savedFavoriteIds);

        if (Array.isArray(parsedFavoriteIds)) {
          return parsedFavoriteIds;
        }
      }
    } catch {
      return [];
    }

    return [];
  });


// persistenza dei preferiti: salva i preferiti quando cambiano
  useEffect(() => {
    localStorage.setItem(
      FAVORITE_MODELS_STORAGE_KEY,
      JSON.stringify(favoriteModelIds)
    );
  }, [favoriteModelIds]);

  
// Funzione per aggiungere o rimuovere un modello dai preferiti
  function toggleFavoriteModel(modelId) {
    if (favoriteModelIds.includes(modelId)) {
      const updatedFavoriteIds = favoriteModelIds.filter((id) => id !== modelId);
      setFavoriteModelIds(updatedFavoriteIds);
      return;
    }

    setFavoriteModelIds([...favoriteModelIds, modelId]);
  }


  return (
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

        {/* Day 4: BrowserRouter handles the list page and the real detail page. */}
        <Routes>
          {/* route per la lista dei modelli, passando i preferiti e la funzione di toggle come props */}
          <Route path="/" element={
              <ModelList
                favoriteModelIds={favoriteModelIds}
                onToggleFavorite={toggleFavoriteModel}
              />
            }
          />
            
          <Route path="/models/:id" element={
              <ModelDetail
                favoriteModelIds={favoriteModelIds}
                onToggleFavorite={toggleFavoriteModel}
              />
            }
          />
          <Route path="/favorites" element={
              <FavoritesPage
                favoriteModelIds={favoriteModelIds}
                onToggleFavorite={toggleFavoriteModel}
              />
            }
          />
          <Route path="/compare" element={<ModelCompare />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
