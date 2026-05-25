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

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedModelIdsText = searchParams.get("ids") || "";
  const selectedModelIds = selectedModelIdsText.split(",").filter(Boolean);
  const hasTwoSelectedModels = selectedModelIds.length === 2;

  const [comparedModels, setComparedModels] = useState([]);
  const [isCompareLoading, setIsCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState("");


  useEffect(() => {
    async function fetchComparedModels() {
      setIsCompareLoading(true);
      setCompareError("");
      setComparedModels([]);

      try {
        const ids = selectedModelIdsText.split(",").filter(Boolean);

        if (ids.length !== 2) {
          return;
        }

        const responses = await Promise.all(
          ids.map((modelId) => fetch(`${API_URL}/models/${modelId}`))
        );

        const hasError = responses.some((response) => !response.ok);

        if (hasError) {
          throw new Error("Impossibile caricare la comparazione.");
        }

        const data = await Promise.all(
          responses.map((response) => response.json())
        );

        const models = data.map((item) => item.model);
        setComparedModels(models);
      } catch {
        setCompareError("Impossibile caricare la comparazione.");
      } finally {
        setIsCompareLoading(false);
      }
    }

    fetchComparedModels();
  }, [selectedModelIdsText]);


  function resetComparedModels() {
    navigate("/");
  }



  return (
    <section className="models-card compare-card">
      <h2>Comparazione modelli</h2>

      {!hasTwoSelectedModels && (
        <p>Seleziona due modelli dalla lista per avviare la comparazione.</p>
      )}

      {isCompareLoading && <p>Caricamento della comparazione...</p>}
      {compareError && <p>{compareError}</p>}

      {comparedModels.length === 2 && !isCompareLoading && !compareError && (
        <>
          <div className="compare-grid">
            {comparedModels.map((model) => (
              <article className="detail-card compare-model-card" key={model.id}>
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
              Azzera comparazione
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default ModelCompare;
