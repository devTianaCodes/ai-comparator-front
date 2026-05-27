import { Link } from "react-router-dom";


function ModelCard({
  model,
  isFavorite,
  onToggleFavorite,
  isSelectedForCompare,
  isCompareLimitReached,
  onToggleCompare,
}) {
 // Disabilita il pulsante "Compara" se il limite di confronto è raggiunto e questo modello non è già selezionato.
  const isCompareButtonDisabled = isCompareLimitReached && !isSelectedForCompare;
  const hasCompareButton = Boolean(onToggleCompare);

  return (
    <li className="model-card">
      <button
        className="favorite-button model-card-favorite"
        type="button"
        title={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        onClick={() => onToggleFavorite(model.id)}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      <img
        className="model-card-image"
        src={model.image}
        alt={`Logo ${model.title}`}
      />

      <div className="model-card-text">
        <h3>{model.title}</h3>
        <p>Categoria: {model.category}</p>
      </div>

      <div className="model-actions">
        {hasCompareButton && (
          <button
            className={isSelectedForCompare ? "compare-button selected-compare-button" : "compare-button"}
            type="button"
            disabled={isCompareButtonDisabled}
            onClick={() => onToggleCompare(model.id)}
          >
            {isSelectedForCompare ? "Selezionato" : "Compara"}
          </button>
        )}

        <Link className="details-link" to={`/models/${model.id}`}>
          Dettagli
        </Link>
      </div>
    </li>
  );
}

export default ModelCard;
