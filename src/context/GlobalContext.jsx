import { createContext, useEffect, useState } from "react";


const FAVORITE_MODELS_STORAGE_KEY = "favoriteModelIds";

const GlobalContext = createContext();

function GlobalProvider({ children }) {

// persistenza dei preferiti: carica i preferiti salvati nel browser
//Legge dal browser i preferiti salvati. Se ci sono, prova a parsearli come array e restituirli, altrimenti restituisce un array vuoto.
  const [favoriteModelIds, setFavoriteModelIds] = useState(() => {

    const savedFavoriteIds = localStorage.getItem(FAVORITE_MODELS_STORAGE_KEY);
    // se ci sono dati salvati, prova a parsearli e restituirli come array, altrimenti restituisci un array vuoto
    try {
      if (savedFavoriteIds) {
        const parsedFavoriteIds = JSON.parse(savedFavoriteIds); //converti la stringa salvata in un array

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
      JSON.stringify(favoriteModelIds)//converte l'array in stringa, perche' localStorage salva solo stringhe.
    );
  }, [favoriteModelIds]);// ogni volta che favoriteModelIds cambia, salva il nuovo array di preferiti nel localStorage del browser


// Funzione per aggiungere o rimuovere un modello dai preferiti
  function toggleFavoriteModel(modelId) {
    // se il modello è già nei preferiti, rimuovilo, altrimenti aggiungilo
    if (favoriteModelIds.includes(modelId)) {
      //Crea un nuovo array senza quel modello.
      const updatedFavoriteIds = favoriteModelIds.filter((id) => id !== modelId);
      setFavoriteModelIds(updatedFavoriteIds);
      return;
    }
    //Se il modello non era nei preferiti, crea un nuovo array aggiungendo modelId
    setFavoriteModelIds([...favoriteModelIds, modelId]);
  }


  return (
    <GlobalContext.Provider value={{ favoriteModelIds, toggleFavoriteModel }}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
