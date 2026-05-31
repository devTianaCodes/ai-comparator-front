import { useContext, useEffect } from "react";
import ModelCard from "../components/ModelCard";
import { GlobalContext } from "../context/GlobalContext";
import useModels from "../hooks/useModels";



function FavoritesPage() {

  const { favoriteModelIds, toggleFavoriteModel } = useContext(GlobalContext);
  const { models, isLoading, error, fetchFullModels } = useModels();


  useEffect(() => {
    fetchFullModels();
  }, [fetchFullModels]);


  const favoriteModels = models.filter((model) =>
    favoriteModelIds.includes(model.id)
  );


  return (
    <section className="models-card">
      <h2>Preferiti</h2>

      {isLoading && <p>Caricamento dei preferiti...</p>}
      {error && <p>{error}</p>}

      {/* gestione degli stati vuoti: messaggio quando la lista preferiti è vuota */}
      {!isLoading && !error && favoriteModels.length === 0 && (
        <p>Lista preferiti vuota.</p>
      )}

      {!isLoading && !error && favoriteModels.length > 0 && (
        <ul className="model-list model-card-list favorites-list">
          {favoriteModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isFavorite={favoriteModelIds.includes(model.id)}
              onToggleFavorite={toggleFavoriteModel}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default FavoritesPage;
