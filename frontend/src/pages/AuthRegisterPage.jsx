import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

function AuthRegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await register(form.username, form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Не вдалось зареєструватися. Можливо, логін вже зайнятий.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card shadow-sm auth-card">
          <div className="card-body">
            <h1 className="h4 mb-3 text-center">Реєстрація</h1>
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
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
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
                {submitting ? "Реєструємо..." : "Зареєструватися"}
              </button>
            </form>
            <p className="mt-3 mb-0 text-center small">
              Уже маєте акаунт?{" "}
              <Link to="/login">
                Увійти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthRegisterPage;

