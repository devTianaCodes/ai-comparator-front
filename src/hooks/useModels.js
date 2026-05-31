import { useCallback, useState } from "react";


const API_URL = import.meta.env.VITE_API_URL;

function useModels() {

  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  const fetchModelById = useCallback(async function fetchModelById(modelId) {
    const response = await fetch(`${API_URL}/models/${modelId}`);

    if (!response.ok) {
      throw new Error("Impossibile caricare il modello.");
    }

    const data = await response.json();
    return data.model;
  }, []);


  const fetchFullModels = useCallback(async function fetchFullModels(query = "") {
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
