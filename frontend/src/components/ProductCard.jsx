import { Link } from "react-router-dom";
import { useShop } from "../state/ShopContext";

function ProductCard({ product }) {
  const { addToCart } = useShop();
  const mainImage = product.images?.find((img) => img.is_main) ?? product.images?.[0];

  return (
    <div className="card h-100 shadow-sm product-card">
      {mainImage && (
        <img
          src={mainImage.image}
          className="card-img-top"
          alt={product.name}
          style={{ objectFit: "cover", height: "180px" }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate" title={product.name}>
          {product.name}
        </h5>
        <p className="card-text text-muted mb-1 text-truncate">{product.brand}</p>
        <p className="fw-bold mb-1">
          {product.price} ₴{" "}
          {product.old_price && (
            <span className="text-decoration-line-through text-muted ms-1">
              {product.old_price} ₴
            </span>
          )}
        </p>
        <p className={product.stock > 0 ? "text-success" : "text-danger"}>
          {product.stock > 0 ? "В наявності" : "Немає в наявності"}
        </p>
        <div className="mt-auto d-flex gap-2">
          <Link
            className="btn btn-outline-secondary btn-sm flex-grow-1"
            to={`/product/${product.slug}`}
          >
            Детальніше
          </Link>
          <button
            type="button"
            className="btn btn-primary btn-sm flex-grow-1"
            disabled={product.stock <= 0}
            onClick={() => addToCart(product)}
          >
            Додати в кошик
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

