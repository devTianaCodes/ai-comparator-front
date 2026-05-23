import { useEffect, useState } from "react";
import ModelRow from "../components/ModelRow";




const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function ModelList() {

  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  
  
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
            <ModelRow key={model.id} model={model} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default ModelList;
