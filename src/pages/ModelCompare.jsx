import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";




const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const compareFields = [
  { label: "Categoria", name: "category" },
  { label: "Fornitore", name: "provider" },
  { label: "Anno di rilascio", name: "releaseYear" },
  { label: "Modalità", name: "modality" },
  { label: "Finestra di contesto", name: "contextWindow" },
  { label: "Fascia di prezzo", name: "pricingTier" },
  { label: "Indice di intelligenza", name: "intelligenceIndex" },
  { label: "Punti di forza", name: "strengths" },
];

function ModelCompare() {

  const navigate = useNavigate(); // navigazione programmatica
  const [searchParams] = useSearchParams(); // hook per leggere i parametri di ricerca dalla URL, in questo caso gli id dei modelli da comparare
  
  const selectedModelIdsText = searchParams.get("ids") || "";
  const selectedModelIds = selectedModelIdsText.split(",").filter(Boolean);
  const hasNoSelectedModels = selectedModelIds.length === 0;
  const hasTwoSelectedModels = selectedModelIds.length === 2;

  const [comparedModels, setComparedModels] = useState([]);
  const [isCompareLoading, setIsCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState("");


// Fetch dei modelli da comparare ogni volta che cambiano i parametri di ricerca (gli id dei modelli da comparare)
  useEffect(() => {
    async function fetchComparedModels() {
      setIsCompareLoading(true);
      setCompareError("");
      setComparedModels([]);

      // Se non ci sono esattamente due id di modelli selezionati, non fare la fetch e aspetta che l'utente selezioni i modelli corretti
      try {
        const ids = selectedModelIdsText.split(",").filter(Boolean);

        if (ids.length !== 2) {
          return;
        }

        const responses = await Promise.all(
          ids.map((modelId) => fetch(`${API_URL}/models/${modelId}`))
        );
        // Controlla se c'è stato un errore in una delle fetch
        const hasError = responses.some((response) => !response.ok);

        if (hasError) {
          throw new Error("Impossibile caricare la comparazione.");
        }
        // Se tutte le fetch sono andate a buon fine, parsea i dati e imposta i modelli comparati nello stato
        const data = await Promise.all(
          responses.map((response) => response.json())
        );

        const models = data.map((item) => item.model);
        setComparedModels(models);
      } catch {
        setCompareError("Impossibile caricare la comparazione.");
      } finally {
        setIsCompareLoading(false);// alla fine della fetch, sia in caso di successo che di errore, imposta isCompareLoading a false per indicare che il caricamento è terminato
      }
    }

    fetchComparedModels();
  }, [selectedModelIdsText]);

  // Funzione per resettare la comparazione, navigando alla home page (lista dei modelli)
  function resetComparedModels() {
    navigate("/");
  }



  return (
    <section className="models-card compare-card">
      <h2>Comparazione modelli</h2>

      {/* gestione degli stati vuoti: messaggio quando non ci sono modelli selezionati */}
      {hasNoSelectedModels && (
        <p>Nessun elemento selezionato nel comparatore.</p>
      )}

      {!hasNoSelectedModels && !hasTwoSelectedModels && (
        <p>Seleziona due modelli dalla lista per avviare la comparazione.</p>
      )}

      {isCompareLoading && <p>Caricamento della comparazione...</p>}
      {compareError && <p>{compareError}</p>}

      {comparedModels.length === 2 && !isCompareLoading && !compareError && (
        <>
          <div className="compare-grid">
            {comparedModels.map((model) => (
              <article className="detail-card compare-model-card" key={model.id}>
                <img
                  className="compare-model-image"
                  src={model.image}
                  alt={`Logo ${model.title}`}
                />

                <h3>{model.title}</h3>

                <p>{model.description}</p>

                <dl>
                  {compareFields.map((field) => (
                    <div key={field.name}>
                      <dt>{field.label}</dt>
                      <dd>{model[field.name] ?? "Non disponibile"}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <div className="compare-reset-container">
            <button
              className="reset-button compare-reset-button"
              type="button"
              onClick={resetComparedModels}
            >
              Annulla comparazione
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default ModelCompare;
