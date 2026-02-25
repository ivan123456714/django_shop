import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../state/AuthContext";

function AdminOrdersPage() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    api
      .get("/orders/")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1 className="h4 mb-3">Замовлення</h1>
      {loading && <p>Завантаження...</p>}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Клієнт</th>
              <th>Телефон</th>
              <th>Сума</th>
              <th>Статус</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.full_name}</td>
                <td>{order.phone}</td>
                <td>{order.total_price} ₴</td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && !orders.length && (
          <p className="text-muted">Немає замовлень.</p>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersPage;

