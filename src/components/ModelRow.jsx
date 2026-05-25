import { Link } from "react-router-dom";


function ModelRow({
  model,
  isFavorite,
  onToggleFavorite,
  isSelectedForCompare,
  isCompareLimitReached,
  onToggleCompare,
}) {
 // Disabilita il pulsante "Compara" se il limite di confronto è raggiunto e questo modello non è già selezionato.
  const isCompareButtonDisabled = isCompareLimitReached && !isSelectedForCompare;

  return (
    <li>
      <span>
        <strong>{model.title}</strong> - {model.category}
      </span>

      <div className="model-actions">
        <button
          className="favorite-button"
          type="button"
          title={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          onClick={() => onToggleFavorite(model.id)}
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        <button
          className="compare-button"
          type="button"
          disabled={isCompareButtonDisabled}
          onClick={() => onToggleCompare(model.id)}
        >
          {isSelectedForCompare ? "Selezionato" : "Compara"}
        </button>

        <Link className="details-link" to={`/models/${model.id}`}>
          Dettagli
        </Link>
      </div>
    </li>
  );
}

export default ModelRow;
