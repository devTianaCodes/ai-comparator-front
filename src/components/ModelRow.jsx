import { Link } from "react-router-dom";


function ModelRow({ model }) {
  return (
    <li>
      <span>
        <strong>{model.title}</strong> - {model.category}
      </span>

      <Link className="details-link" to={`/models/${model.id}`}>
        Details
      </Link>
    </li>
  );
}

export default ModelRow;
