import { useState } from "react";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function useModels() {

  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  async function fetchModelById(modelId) {
    const response = await fetch(`${API_URL}/models/${modelId}`);

    if (!response.ok) {
      throw new Error("Impossibile caricare il modello.");
    }

    const data = await response.json();
    return data.model;
  }


  async function fetchModels(query = "") {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/models${query}`);

      if (!response.ok) {
        throw new Error("Impossibile caricare i modelli.");
      }

      const data = await response.json();
      setModels(data);
      return data;

    } catch {
      setError("Impossibile caricare i modelli.");
      return [];
      
    } finally {
      setIsLoading(false);
    }
  }


  return {
    models,
    isLoading,
    error,
    fetchModels,
    fetchModelById,
  };
}

export default useModels;
