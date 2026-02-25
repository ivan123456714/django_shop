import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../state/ShopContext";

function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useShop();
  const navigate = useNavigate();

  if (!cart.length) {
    return (
      <div className="text-center">
        <p className="mb-3">Ваш кошик порожній.</p>
        <Link to="/catalog" className="btn btn-primary">
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-8">
        <ul className="list-group">
          {cart.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 64, height: 64, objectFit: "cover" }}
                    className="rounded"
                  />
                )}
                <div>
                  <Link to={`/product/${item.slug}`} className="fw-semibold">
                    {item.name}
                  </Link>
                  <p className="mb-0 text-muted">{item.price} ₴</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, Number(e.target.value) || 1)
                  }
                  className="form-control form-control-sm"
                  style={{ width: 70 }}
                />
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-12 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Замовлення</h5>
            <p className="d-flex justify-content-between">
              <span>Сума:</span>
              <span className="fw-bold">{totalPrice.toFixed(2)} ₴</span>
            </p>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={() => navigate("/checkout")}
            >
              Оформити замовлення
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

