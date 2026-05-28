import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ModelCard from "../components/ModelCard";




const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function ModelList({ favoriteModelIds, onToggleFavorite }) {

  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [compareModelIds, setCompareModelIds] = useState([]);
  
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


// Fetch categories on initial load
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${API_URL}/models`);

        if (!response.ok) {
          throw new Error("Impossibile caricare le categorie.");
        }

        const data = await response.json();
        const modelCategories = data.map((model) => model.category);
        const uniqueCategories = [...new Set(modelCategories)].sort();
        setCategories(uniqueCategories);
      } catch {
        setError("Impossibile caricare le categorie.");
      }
    }

    fetchCategories();
  }, []); // Empty dependency: runs only once on initial load


// debounces: aspetta che l'utente finisca di scrivere prima di cercare i modelli
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [search]);


// Fetch models whenever the debounced search term or selected category changes
  useEffect(() => {
    async function fetchModels() {
      setIsLoading(true);
      setError("");

      try {
        const query = new URLSearchParams();
        
        if (debouncedSearch.trim()) {
          query.append("search", debouncedSearch.trim());
        }

        if (category) {
          query.append("category", category);
        }

        const url = `${API_URL}/models?${query.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Impossibile caricare i modelli.");
        }

        const data = await response.json();

        const modelsWithImages = await Promise.all(
          data.map(async (model) => {
            const detailResponse = await fetch(`${API_URL}/models/${model.id}`);

            if (!detailResponse.ok) {
              throw new Error("Impossibile caricare le immagini dei modelli.");
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
        setError("Impossibile caricare i modelli.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchModels();
  }, [debouncedSearch, category]); // Dependency array: runs whenever 'debouncedSearch' or 'category' changes



  // Sort models based on the selected field and order  
  //useMemo is used to optimize performance by memoizing the sorted list of models, 
  // so it only recalculates when the models, sortField, or sortOrder change.
  const sortedModels = useMemo(() => {
    return [...models].sort((firstModel, secondModel) => {

      const firstValue = firstModel[sortField] || "";
      const secondValue = secondModel[sortField] || "";

      if (firstValue < secondValue) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (firstValue > secondValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
// If values are equal, maintain their original order
      return 0;
    });
  }, [models, sortField, sortOrder]);



  function toggleCompareModel(modelId) {
    if (compareModelIds.includes(modelId)) {
      const updatedModelIds = compareModelIds.filter((id) => id !== modelId);
      setCompareModelIds(updatedModelIds);
      return;
    }

    if (compareModelIds.length < 2) {
      setCompareModelIds([...compareModelIds, modelId]);
    }
  }

// Resetta la selezione dei modelli per il confronto
  function resetCompareModels() {
    setCompareModelIds([]);
  }

// Costruisce il link per la pagina di comparazione con gli ID dei modelli selezionati
  const compareLink = `/compare?ids=${compareModelIds.join(",")}`;


  return (
    <section className="models-card">
      <h2>Modelli IA</h2>

      <div className="homepage-layout">
        <div className="filters">

          <label htmlFor="search">Cerca per nome</label>
          <input
            id="search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cerca un modello..."
          />

          <label htmlFor="category">Filtra per categoria</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Tutte le categorie</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label htmlFor="sortField">Ordina per</label>

          <select
            id="sortField"
            value={sortField}
            onChange={(event) => setSortField(event.target.value)}
          >
            <option value="title">Nome</option>
            <option value="category">Categoria</option>
          </select>


          <label htmlFor="sortOrder">Direzione</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>

          {!isLoading && !error && (
            <div className="compare-section">
              <h3>Compara</h3>

              <p className="compare-counter">
                Seleziona due modelli per confronto: {compareModelIds.length}/2
              </p>

              {compareModelIds.length === 2 && (
                <Link className="compare-link" to={compareLink}>
                  <span className="compare-icon">⚖</span> Vai alla comparazione
                </Link>
              )}

              {compareModelIds.length > 0 && (

                <button
                  className="reset-button cancel-selection-button"
                  type="button"
                  onClick={resetCompareModels}
                >
                  🗑 Annulla selezione
                </button>
              )}
            </div>
          )}
        </div>

        <div className="models-list-container">
          {isLoading && <p>Caricamento dei modelli...</p>}
          {error && <p>{error}</p>}

          {/* gestione degli stati vuoti: messaggio quando non ci sono risultati */}
          {!isLoading && !error && sortedModels.length === 0 && (
            <p>Nessun risultato trovato.</p>
          )}

          {!isLoading && !error && sortedModels.length > 0 && (
            <ul className="model-list model-card-list">
              {sortedModels.map((model) => (
                
                // Passa le props necessarie a ModelCard, inclusi i preferiti e la funzione di toggle dei preferiti, e le props per la comparazione
                <ModelCard
                  key={model.id}
                  model={model}
                  isFavorite={favoriteModelIds.includes(model.id)}
                  onToggleFavorite={onToggleFavorite}
                  isSelectedForCompare={compareModelIds.includes(model.id)}
                  isCompareLimitReached={compareModelIds.length === 2}
                  onToggleCompare={toggleCompareModel}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default ModelList;
