import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function App() {
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchModels() {
      setIsLoading(true);
      setError("");

      try {
        const query = new URLSearchParams();

        if (search.trim()) {
          query.append("search", search.trim());
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
  }, [search]);

  return (
    <main>
      <h1>AI Comparator</h1>

      <section>
        <h2>AI Models</h2>

        <label htmlFor="search">Search by title</label>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search a model..."
        />

        {isLoading && <p>Loading models...</p>}
        {error && <p>{error}</p>}

        {!isLoading && !error && (
          <ul>
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
