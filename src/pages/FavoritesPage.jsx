import { useEffect, useState } from "react";
import ModelCard from "../components/ModelCard";




const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function FavoritesPage({ favoriteModelIds, onToggleFavorite }) {

  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function fetchModels() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/models`);

        if (!response.ok) {
          throw new Error("Impossibile caricare i preferiti.");
        }

        const data = await response.json();

        const modelsWithImages = await Promise.all(
          data.map(async (model) => {
            const detailResponse = await fetch(`${API_URL}/models/${model.id}`);

            if (!detailResponse.ok) {
              throw new Error("Impossibile caricare le immagini dei preferiti.");
            }

            const detailData = await detailResponse.json();

            return {
              ...model,
              image: detailData.model.image,
            };
          })
        );

        setModels(modelsWithImages);
      } catch {
        setError("Impossibile caricare i preferiti.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchModels();
  }, []);


  const favoriteModels = models.filter((model) =>
    favoriteModelIds.includes(model.id)
  );


  return (
    <section className="models-card">
      <h2>Preferiti</h2>

      {isLoading && <p>Caricamento dei preferiti...</p>}
      {error && <p>{error}</p>}

      {!isLoading && !error && favoriteModels.length === 0 && (
        <p>Nessun preferito selezionato.</p>
      )}

      {!isLoading && !error && favoriteModels.length > 0 && (
        <ul className="model-list model-card-list favorites-list">
          {favoriteModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isFavorite={favoriteModelIds.includes(model.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default FavoritesPage;
