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
    // se ci sono dati salvati, prova a parsearli e restituirli come array, altrimenti restituisci un array vuoto
    try {
      if (savedFavoriteIds) {
        const parsedFavoriteIds = JSON.parse(savedFavoriteIds);

        if (Array.isArray(parsedFavoriteIds)) {
          return parsedFavoriteIds;
        }
      }
    } catch {
      return [];// se c'è un errore nel parsing, restituisci un array vuoto
    }

    return [];// se non ci sono dati salvati, restituisci un array vuoto
  });


// persistenza dei preferiti: salva i preferiti quando cambiano
  useEffect(() => {
    localStorage.setItem(
      FAVORITE_MODELS_STORAGE_KEY,
      JSON.stringify(favoriteModelIds)
    );
  }, [favoriteModelIds]);// ogni volta che favoriteModelIds cambia, salva il nuovo array di preferiti nel localStorage del browser

  
// Funzione per aggiungere o rimuovere un modello dai preferiti
  function toggleFavoriteModel(modelId) {
    // se il modello è già nei preferiti, rimuovilo, altrimenti aggiungilo
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
