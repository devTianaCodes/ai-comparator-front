import { useEffect, useState } from "react";
import { Link } from "react-router-dom";




const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function FavoritesPanel({ favoriteModelIds, onToggleFavorite }) {

  const [models, setModels] = useState([]);

//fetch per ottenere tutti i modelli e filtrare quelli preferiti
  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch(`${API_URL}/models`);

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setModels(data);
      } catch {
        setModels([]);
      }
    }

    fetchModels();
  }, []);


  const favoriteModels = models.filter((model) =>
    favoriteModelIds.includes(model.id)
  );


  return (
    <aside className="favorites-panel">
      <h2>Preferiti</h2>

      {favoriteModels.length === 0 && (
        <p>Nessun preferito selezionato.</p>
      )}

      {favoriteModels.length > 0 && (
        <ul>
          {favoriteModels.map((model) => (
            <li key={model.id}>
              <Link to={`/models/${model.id}`}>
                {model.title}
              </Link>

              <button
                className="favorite-button"
                type="button"
                title="Rimuovi dai preferiti"
                aria-label="Rimuovi dai preferiti"
                onClick={() => onToggleFavorite(model.id)}
              >
                ♥
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default FavoritesPanel;
