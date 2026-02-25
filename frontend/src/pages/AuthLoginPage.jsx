import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

function AuthLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(form.username, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Невірний логін або пароль.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card shadow-sm auth-card">
          <div className="card-body">
            <h1 className="h4 mb-3 text-center">Вхід</h1>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label">Логін</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  required
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="form-label">Пароль</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  required
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              {error && <p className="text-danger small mb-0">{error}</p>}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={submitting}
              >
                {submitting ? "Входимо..." : "Увійти"}
              </button>
            </form>
            <p className="mt-3 mb-0 text-center small">
              Немає акаунта?{" "}
              <Link to="/register">
                Зареєструватись
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLoginPage;

