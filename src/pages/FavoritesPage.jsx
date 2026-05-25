import { useEffect, useState } from "react";
import { Link } from "react-router-dom";




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
        setModels(data);
      } catch (error) {
        setError(error.message);
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
        <ul className="model-list">
          {favoriteModels.map((model) => (
            <li key={model.id}>
              <span>
                <strong>{model.title}</strong> - {model.category}
              </span>

              <div className="model-actions">
                <button
                  className="favorite-button"
                  type="button"
                  title="Rimuovi dai preferiti"
                  aria-label="Rimuovi dai preferiti"
                  onClick={() => onToggleFavorite(model.id)}
                >
                  ♥
                </button>

                <Link className="details-link" to={`/models/${model.id}`}>
                  Dettagli
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default FavoritesPage;
