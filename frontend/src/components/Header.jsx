import { Link, NavLink } from "react-router-dom";
import { useShop } from "../state/ShopContext";
import { useAuth } from "../state/AuthContext";

function Header() {
  const { cart } = useShop();
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          PC Shop
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/catalog">
                Каталог
              </NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/orders">
                  Адмін
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/cart">
                Кошик ({itemsCount})
              </NavLink>
            </li>
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink className="btn btn-outline-light btn-sm" to="/login">
                    Вхід
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="btn btn-primary btn-sm" to="/register">
                    Реєстрація
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  {user.username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={logout}
                    >
                      Вийти
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;

