import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";




const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function ModelDetail() {

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
          throw new Error("Unable to load model details.");
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
        Back to list
      </Link>

      {isDetailLoading && <p>Loading details...</p>}
      {detailError && <p>{detailError}</p>}

      {selectedModel && !isDetailLoading && !detailError && (
        <article className="detail-card">
          <h2>{selectedModel.title}</h2>

          <p>{selectedModel.description}</p>

          <dl>
            <div>
              <dt>Category</dt>
              <dd>{selectedModel.category}</dd>
            </div>

            <div>
              <dt>Provider</dt>
              <dd>{selectedModel.provider}</dd>
            </div>

            <div>
              <dt>Release year</dt>
              <dd>{selectedModel.releaseYear}</dd>
            </div>

            <div>
              <dt>Modality</dt>
              <dd>{selectedModel.modality}</dd>
            </div>

            <div>
              <dt>Context window</dt>
              <dd>{selectedModel.contextWindow}</dd>
            </div>

            <div>
              <dt>Pricing tier</dt>
              <dd>{selectedModel.pricingTier}</dd>
            </div>

            <div>
              <dt>Intelligence index</dt>
              <dd>{selectedModel.intelligenceIndex}</dd>
            </div>

            <div>
              <dt>Strengths</dt>
              <dd>{selectedModel.strengths}</dd>
            </div>
          </dl>
        </article>
      )}
    </section>
  );
}

export default ModelDetail;
