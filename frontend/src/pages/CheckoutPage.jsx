import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../state/ShopContext";
import api from "../api";

function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    payment_method: "card",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!cart.length) {
    return <p>Спочатку додайте товари до кошика.</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/orders/", {
        ...form,
        items: cart.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
      });
      clearCart();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Сталася помилка при оформленні.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-8">
        <h1 className="h4 mb-3">Оформлення замовлення</h1>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">ПІБ</label>
            <input
              type="text"
              className="form-control"
              name="full_name"
              required
              value={form.full_name}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Телефон</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Адреса</label>
            <input
              type="text"
              className="form-control"
              name="address"
              required
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Місто</label>
            <input
              type="text"
              className="form-control"
              name="city"
              required
              value={form.city}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Спосіб оплати</label>
            <select
              className="form-select"
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
            >
              <option value="card">Карткою онлайн</option>
              <option value="cash">Готівкою при отриманні</option>
            </select>
          </div>
          {error && <p className="text-danger">{error}</p>}
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Надсилаємо..." : "Замовити"}
            </button>
          </div>
        </form>
      </div>
      <div className="col-12 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Ваше замовлення</h5>
            <ul className="list-group mb-3">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} ₴</span>
                </li>
              ))}
            </ul>
            <p className="d-flex justify-content-between">
              <span>Разом:</span>
              <span className="fw-bold">{totalPrice.toFixed(2)} ₴</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

