import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../api";

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const params = {
    search: query.get("search") || "",
    category: query.get("category") || "",
    brand: query.get("brand") || "",
    price_min: query.get("price_min") || "",
    price_max: query.get("price_max") || "",
    ordering: query.get("ordering") || "",
  };

  const fetchProducts = () => {
    setLoading(true);
    api
      .get("/products/", { params })
      .then((res) => {
        setProducts(res.data);
        const uniqueBrands = Array.from(
          new Set(res.data.map((p) => p.brand).filter(Boolean))
        );
        setBrands(uniqueBrands);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const updateQuery = (changes) => {
    const newQuery = new URLSearchParams(location.search);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) {
        newQuery.set(key, value);
      } else {
        newQuery.delete(key);
      }
    });
    navigate(`/catalog?${newQuery.toString()}`);
  };

  return (
    <div className="row g-4">
      <div className="col-12 col-md-3">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Фільтри</h5>
            <div className="mb-3">
              <label className="form-label">Мін. ціна</label>
              <input
                type="number"
                className="form-control"
                defaultValue={params.price_min}
                onBlur={(e) => updateQuery({ price_min: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Макс. ціна</label>
              <input
                type="number"
                className="form-control"
                defaultValue={params.price_max}
                onBlur={(e) => updateQuery({ price_max: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Бренд</label>
              <select
                className="form-select"
                value={params.brand}
                onChange={(e) => updateQuery({ brand: e.target.value })}
              >
                <option value="">Усі</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-9">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Каталог</h2>
          <select
            className="form-select w-auto"
            value={params.ordering}
            onChange={(e) => updateQuery({ ordering: e.target.value })}
          >
            <option value="">За замовчуванням</option>
            <option value="price">Ціна: від дешевих до дорогих</option>
            <option value="-price">Ціна: від дорогих до дешевих</option>
            <option value="-created_at">Спочатку нові</option>
          </select>
        </div>
        {loading && <p>Завантаження...</p>}
        <div className="row g-3">
          {products.map((product) => (
            <div className="col-12 col-md-4 col-lg-3" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
          {!loading && products.length === 0 && (
            <p className="text-muted">Товарів не знайдено.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CatalogPage;

