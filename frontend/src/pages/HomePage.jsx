import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../api";

function HomePage() {
  const [promoProducts, setPromoProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/products/", { params: { is_promo: true } })
      .then((res) => setPromoProducts(res.data))
      .catch(() => {});
    api
      .get("/categories/")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/catalog?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="d-flex flex-column gap-4">
      <section className="hero-section rounded-4 p-4 p-md-5 mb-2 text-white d-flex flex-column flex-md-row align-items-center">
        <div className="flex-grow-1 mb-3 mb-md-0">
          <h1 className="display-6 fw-bold mb-3">
            Магазин комплектуючих для вашого ідеального ПК
          </h1>
          <p className="lead mb-4">
            Процесори, відеокарти, ноутбуки та інші компоненти з актуальними
            знижками й швидкою доставкою.
          </p>
          <form className="input-group input-group-lg hero-search" onSubmit={onSearchSubmit}>
            <input
              type="text"
              className="form-control"
              placeholder="Пошук за назвою або моделлю..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-light fw-semibold" type="submit">
              Знайти
            </button>
          </form>
        </div>
        <div className="hero-badge text-md-end text-center">
          <div className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill mb-2">
            -30% на обрані відеокарти
          </div>
          <p className="mb-0 small opacity-75">
            Пропозиція обмежена. Перегляньте акційні товари нижче.
          </p>
        </div>
      </section>

      <section>
        <h2 className="h4 mb-3">Акційні пропозиції</h2>
        <div className="promo-scroll row g-3 flex-nowrap overflow-auto pb-2">
          {promoProducts.map((product) => (
            <div className="col-10 col-md-4 col-lg-3" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
          {promoProducts.length === 0 && <p className="text-muted">Наразі немає акцій.</p>}
        </div>
      </section>

      <section>
        <h2 className="h4 mb-3">Категорії</h2>
        <div className="row g-3">
          {categories.map((cat) => (
            <div className="col-6 col-md-4 col-lg-3" key={cat.id}>
              <Link
                to={`/catalog?category=${cat.slug}`}
                className="text-decoration-none"
              >
                <div className="card text-center shadow-sm h-100 category-card">
                  <div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
                    <span className="fw-semibold mb-1">{cat.name}</span>
                    <span className="small text-muted">Перейти до товарів</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;

