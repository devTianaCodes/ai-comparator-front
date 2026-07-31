import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ModelCard from "../components/ModelCard";
import { GlobalContext } from "../context/GlobalContext";
import useModels from "../hooks/useModels";




const API_URL = import.meta.env.VITE_API_URL;

function ModelList() {

  const { favoriteModelIds, toggleFavoriteModel } = useContext(GlobalContext);
  const { models, isLoading, error, fetchFullModels } = useModels();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [compareModelIds, setCompareModelIds] = useState([]);
  const [categoryError, setCategoryError] = useState("");
  

//useEffect per fetchare le categorie dei modelli al caricamento della pagina, 
// per popolare il filtro delle categorie, e gestire eventuali errori di fetch delle categorie
  useEffect(() => {
    async function fetchCategories() {
      try {
        setCategoryError("");
        const response = await fetch(`${API_URL}/models`);

        if (!response.ok) {
          throw new Error("Impossibile caricare le categorie.");
        }

        const data = await response.json();
        const modelCategories = data.map((model) => model.category);
        
        const uniqueCategories = [];

        modelCategories.forEach((category) => {
          if (!uniqueCategories.includes(category)) {
            uniqueCategories.push(category);
          }
        });

        uniqueCategories.sort();// ordina le categorie in ordine alfabetico per una migliore UX nel filtro
        setCategories(uniqueCategories);
      } catch {
        setCategoryError("Impossibile caricare le categorie.");
      }
    }

    fetchCategories();
  }, []); // Empty dependency: runs only once on initial load


// debounce ritarda l'aggiornamento della ricerca per migliorare le prestazioni.
  const debounce = useCallback((callback, delay) => {
    let timeoutId;

    return (value) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => { // Imposta un nuovo timeout per ritardare l'esecuzione della funzione di callback
        callback(value);
      }, delay);
    };
  }, []);

// funzione memorizzata aggiorna la ricerca con un piccolo ritardo.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearch = useCallback(
    debounce(setSearch, 500),
    []
  );


//useEffect per fetchare i modelli ogni volta che cambiano i parametri di ricerca 
// (search e category)
  useEffect(() => {
    const query = new URLSearchParams();
        
    if (search.trim()) {
      query.append("search", search.trim());
    }

    if (category) {
      query.append("category", category);
    }

    const queryString = query.toString();
    const modelsQuery = queryString ? `?${queryString}` : "";

    fetchFullModels(modelsQuery);
  }, [search, category, fetchFullModels]); // Dependency array: runs whenever 'search' or 'category' changes



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


// Funzione per gestire la selezione dei modelli da comparare, 
// limitando la selezione a due modelli, 
// e permettendo di deselezionare un modello già selezionato
  function toggleCompareModel(modelId) {
    // Se il modello è già selezionato per la comparazione, deselezionalo
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
  const errorMessage = error || categoryError;
  const loadingCards = [1, 2, 3, 4];


  return (
    <section className="models-card">
      <h2>Modelli IA</h2>

      <div className="homepage-layout">
        <div className="filters">

          <label htmlFor="search">Cerca per nome</label>
          <input
            id="search"
            type="search"
            onChange={(event) => debouncedSetSearch(event.target.value)}
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

          {!isLoading && !errorMessage && (
            <div className="compare-section">
              <h3>Compara ({compareModelIds.length}/2)</h3>

              <p className="compare-counter">
                Seleziona due modelli per confronto.
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
          {/* loading skeletons: card provvisorie mostrate mentre i modelli vengono caricati */}
          {isLoading && (
            <ul className="model-list model-card-list">
              {loadingCards.map((cardNumber) => (
                <li className="model-card skeleton-card" key={cardNumber}>
                  <div className="skeleton-image"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-actions"></div>
                </li>
              ))}
            </ul>
          )}

          {errorMessage && <p>{errorMessage}</p>}

          {/* gestione degli stati vuoti: messaggio quando non ci sono risultati */}
          {!isLoading && !errorMessage && sortedModels.length === 0 && (
            <p className="empty-state">
              Nessun risultato trovato. Prova a cambiare ricerca o categoria.
            </p>
          )}

          {!isLoading && !errorMessage && sortedModels.length > 0 && (
            <ul className="model-list model-card-list">
              {sortedModels.map((model) => (
                
                // Passa le props necessarie a ModelCard, inclusi i preferiti e la funzione di toggle dei preferiti, e le props per la comparazione
                <ModelCard
                  key={model.id}
                  model={model}
                  isFavorite={favoriteModelIds.includes(model.id)}
                  onToggleFavorite={toggleFavoriteModel}
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
