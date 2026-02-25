import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useShop } from "../state/ShopContext";
import api from "../api";

function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useShop();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    api
      .get(`/products/${slug}/`)
      .then((res) => {
        setProduct(res.data);
        const main =
          res.data.images?.find((img) => img.is_main) ?? res.data.images?.[0] ?? null;
        setActiveImage(main);
      })
      .catch(() => {});
  }, [slug]);

  if (!product) {
    return <p>Завантаження...</p>;
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-md-6">
        {activeImage && (
          <img
            src={activeImage.image}
            alt={product.name}
            className="img-fluid rounded shadow-sm mb-3"
          />
        )}
        <div className="d-flex gap-2 flex-wrap">
          {product.images?.map((img) => (
            <button
              key={img.id}
              type="button"
              className={`border-0 p-0 bg-transparent ${
                activeImage?.id === img.id ? "opacity-75" : ""
              }`}
              onClick={() => setActiveImage(img)}
            >
              <img
                src={img.image}
                alt=""
                style={{ width: 80, height: 80, objectFit: "cover" }}
                className="rounded"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="col-12 col-md-6">
        <h1 className="h3">{product.name}</h1>
        <p className="text-muted">{product.brand}</p>
        <p className="fs-4 fw-bold">
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
        <button
          type="button"
          className="btn btn-primary mb-4"
          disabled={product.stock <= 0}
          onClick={() => addToCart(product)}
        >
          Додати в кошик
        </button>

        <h2 className="h5 mt-4">Характеристики</h2>
        <table className="table table-sm">
          <tbody>
            {product.socket && (
              <tr>
                <th>Сокет</th>
                <td>{product.socket}</td>
              </tr>
            )}
            {product.frequency && (
              <tr>
                <th>Частота</th>
                <td>{product.frequency}</td>
              </tr>
            )}
            {product.memory_type && (
              <tr>
                <th>Тип пам&apos;яті</th>
                <td>{product.memory_type}</td>
              </tr>
            )}
            {product.specs &&
              Object.entries(product.specs).map(([key, value]) => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{String(value)}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <h2 className="h5 mt-4">Відгуки</h2>
        <div className="d-flex flex-column gap-2">
          {product.reviews?.length ? (
            product.reviews.map((review) => (
              <div key={review.id} className="border rounded p-2">
                <div className="d-flex justify-content-between">
                  <strong>{review.user_name}</strong>
                  <span>{review.rating} / 5</span>
                </div>
                <p className="mb-0">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-muted">Ще немає відгуків.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

