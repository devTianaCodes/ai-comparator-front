import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function App() {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch(`${API_URL}/models`);

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
  }, []);

  return (
    <main>
      <h1>AI Comparator</h1>

      <section>
        <h2>AI Models</h2>

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
