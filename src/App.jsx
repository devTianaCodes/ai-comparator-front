import { useEffect, useState } from "react";
import "./App.css";




const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function App() {

  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");



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
  }, []);



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
  }, [search, category]);



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
        </div>

        {isLoading && <p>Loading models...</p>}
        {error && <p>{error}</p>}

        {!isLoading && !error && (
          <ul className="model-list">
            {models.map((model) => (
              <li key={model.id}>
                <strong>{model.title}</strong> - {model.category}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
