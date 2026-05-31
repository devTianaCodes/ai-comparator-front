import { useCallback, useState } from "react";


const API_URL = import.meta.env.VITE_API_URL;

function useModels() {

  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

// Funzione per fetchare un singolo modello per id, usata nella pagina di dettaglio del modello e nella lista dei modelli per mostrare le immagini nei card
  const fetchModelById = useCallback(async function fetchModelById(modelId) {
    const response = await fetch(`${API_URL}/models/${modelId}`);

    if (!response.ok) {
      throw new Error("Impossibile caricare il modello.");
    }

    const data = await response.json();
    return data.model;
  }, []);

// Funzione per fetchare i modelli con immagini, usata nella lista dei modelli per mostrare le immagini nei card
  const fetchFullModels = useCallback(async function fetchFullModels(query = "") { //useCallback per evitare di ricreare la funzione ad ogni render, e accettare un parametro di query per filtrare i modelli
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/models${query}`);

      if (!response.ok) {
        throw new Error("Impossibile caricare i modelli.");
      }

      const data = await response.json();

      const fullModels = await Promise.all(
        data.map((model) => fetchModelById(model.id))
      );

      setModels(fullModels);
      return fullModels;

    } catch {
      setError("Impossibile caricare i modelli.");
      return [];
      
    } finally {
      setIsLoading(false);
    }
  }, [fetchModelById]);


  return {
    models,
    isLoading,
    error,
    fetchFullModels,
    fetchModelById,
  };
}

export default useModels;
