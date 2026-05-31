import { createContext, useEffect, useState } from "react";


const FAVORITE_MODELS_STORAGE_KEY = "favoriteModelIds";

const GlobalContext = createContext();

function GlobalProvider({ children }) {

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
    <GlobalContext.Provider value={{ favoriteModelIds, toggleFavoriteModel }}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
