import { useEffect, useState } from "react";
import "./App.css";




const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function App() {

  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  // State to track the selected model for details view
  const [selectedModelId, setSelectedModelId] = useState(null);
  // State to hold the details of the selected model
  const [selectedModel, setSelectedModel] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


// Fetch categories on initial load
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${API_URL}/models`);

        if (!response.ok) {
          throw new Error("Unable to load categories.");
        }

        const data = await response.json();
        const modelCategories = data.map((model) => model.category);
        const uniqueCategories = [...new Set(modelCategories)].sort();
        setCategories(uniqueCategories);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchCategories();
  }, []); // Empty dependency: runs only once on initial load


// Fetch models whenever the search term or selected category changes
  useEffect(() => {
    async function fetchModels() {
      setIsLoading(true);
      setError("");

      try {
        const query = new URLSearchParams();

        if (search.trim()) {
          query.append("search", search.trim());
        }

        if (category) {
          query.append("category", category);
        }

        const url = `${API_URL}/models?${query.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Unable to load models.");
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
  }, [search, category]); // Dependency array: runs whenever 'search' or 'category' changes



  // Fetch details of the selected model whenever the selectedModelId changes
  useEffect(() => {
    if (!selectedModelId) {
      return;
    }
    // Reset previous details and errors when a new model is selected
    async function fetchSelectedModel() {
      setIsDetailLoading(true);
      setDetailError("");
      setSelectedModel(null);

      try {
        const response = await fetch(`${API_URL}/models/${selectedModelId}`);

        if (!response.ok) {
          throw new Error("Unable to load model details.");
        }

        const data = await response.json();
        setSelectedModel(data);
      } catch (error) {
        setDetailError(error.message);
      } finally {
        setIsDetailLoading(false);
      }
    }
    // Call the function to fetch details of the selected model
    fetchSelectedModel();
  }, [selectedModelId]);// Dependency array: runs whenever 'selectedModelId' changes




  // Sort models based on the selected field and order  
  const sortedModels = [...models].sort((firstModel, secondModel) => {

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



  return (
    <main className="page">
      <h1>AI Comparator</h1>

      <section className="models-card">
        <h2>AI Models</h2>

        <div className="filters">

          <label htmlFor="search">Search by title</label>
          <input
            id="search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search a model..."
          />

          <label htmlFor="category">Filter by category</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label htmlFor="sortField">Sort by</label>

          <select
            id="sortField"
            value={sortField}
            onChange={(event) => setSortField(event.target.value)}
          >
            <option value="title">Title</option>
            <option value="category">Category</option>
          </select>


          <label htmlFor="sortOrder">Order</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>

        {isLoading && <p>Loading models...</p>}
        {error && <p>{error}</p>}

        {!isLoading && !error && (
          <ul className="model-list">
            {sortedModels.map((model) => (
              <li key={model.id}>
                <span>
                  <strong>{model.title}</strong> - {model.category}
                </span>

                <button
                  type="button"
                  className={selectedModelId === model.id ? "selected-button" : ""}
                  onClick={() => setSelectedModelId(model.id)}
                >
                  {selectedModelId === model.id ? "Selected" : "Details"}
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {isDetailLoading && <p>Loading details...</p>}//
        {detailError && <p>{detailError}</p>}
        {selectedModel && !isDetailLoading && !detailError && (
          <p>
            Details loaded for <strong>{selectedModel.title}</strong>
          </p>
        )}
      </section>
    </main>
  );
}

export default App;
