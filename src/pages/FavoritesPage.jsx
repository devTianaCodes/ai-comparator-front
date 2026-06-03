import { useContext, useEffect } from "react";
import ModelCard from "../components/ModelCard";
import { GlobalContext } from "../context/GlobalContext";
import useModels from "../hooks/useModels";



function FavoritesPage() {

  const { favoriteModelIds, toggleFavoriteModel } = useContext(GlobalContext);
  const { models, isLoading, error, fetchFullModels } = useModels();

 // Effettua il fetch dei modelli quando il componente viene montato, 
 // per avere i dati completi dei modelli preferiti da mostrare nei card, 
 // e aggiorna la lista dei modelli ogni volta che cambia la funzione di fetch 
 // (che dipende dalla funzione di fetch del singolo modello)
  useEffect(() => {
    fetchFullModels();
  }, [fetchFullModels]);

  
  // Filtra i modelli per mostrare solo quelli che sono nei preferiti, 
  // usando gli id dei preferiti per confrontare con gli id dei modelli
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
