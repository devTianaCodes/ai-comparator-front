import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";




const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function ModelDetail({ favoriteModelIds, onToggleFavorite }) {

  const { id } = useParams();

  // State to hold the details of the selected model
  const [selectedModel, setSelectedModel] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState("");


  // Fetch details of the selected model whenever the id changes
  useEffect(() => {
    async function fetchSelectedModel() {
      setIsDetailLoading(true);
      setDetailError("");
      setSelectedModel(null);

      try {
        const response = await fetch(`${API_URL}/models/${id}`);

        if (!response.ok) {
          throw new Error("Impossibile caricare i dettagli del modello.");
        }

        const data = await response.json();
        setSelectedModel(data.model);
      } catch (error) {
        setDetailError(error.message);
      } finally {
        setIsDetailLoading(false);
      }
    }
    // Call the function to fetch details of the selected model
    fetchSelectedModel();
  }, [id]);// Dependency array: runs whenever 'id' changes



  return (
    <section className="models-card">
      <Link className="back-link" to="/">
        Torna alla lista
      </Link>

      {isDetailLoading && <p>Caricamento dei dettagli...</p>}
      {detailError && <p>{detailError}</p>}

      {selectedModel && !isDetailLoading && !detailError && (
        <article className="detail-card">
          <h2>{selectedModel.title}</h2>

          <button
            className="favorite-button"
            type="button"
            title={favoriteModelIds.includes(selectedModel.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            aria-label={favoriteModelIds.includes(selectedModel.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            onClick={() => onToggleFavorite(selectedModel.id)}
          >
            {favoriteModelIds.includes(selectedModel.id) ? "♥" : "♡"}
          </button>

          <p>{selectedModel.description}</p>

          <dl>
            <div>
              <dt>Categoria</dt>
              <dd>{selectedModel.category}</dd>
            </div>

            <div>
              <dt>Fornitore</dt>
              <dd>{selectedModel.provider}</dd>
            </div>

            <div>
              <dt>Anno di rilascio</dt>
              <dd>{selectedModel.releaseYear}</dd>
            </div>

            <div>
              <dt>Modalità</dt>
              <dd>{selectedModel.modality}</dd>
            </div>

            <div>
              <dt>Finestra di contesto</dt>
              <dd>{selectedModel.contextWindow}</dd>
            </div>

            <div>
              <dt>Fascia di prezzo</dt>
              <dd>{selectedModel.pricingTier}</dd>
            </div>

            <div>
              <dt>Indice di intelligenza</dt>
              <dd>{selectedModel.intelligenceIndex}</dd>
            </div>

            <div>
              <dt>Punti di forza</dt>
              <dd>{selectedModel.strengths}</dd>
            </div>
          </dl>
        </article>
      )}
    </section>
  );
}

export default ModelDetail;
