import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AuthLoginPage from "./pages/AuthLoginPage";
import AuthRegisterPage from "./pages/AuthRegisterPage";

function App() {
  return (
    <div className="bg-body min-vh-100 d-flex flex-column">
      <Header />
      <div className="container flex-grow-1 py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/login" element={<AuthLoginPage />} />
          <Route path="/register" element={<AuthRegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <footer className="border-top py-3 mt-4 small text-muted text-center">
        PC Shop © {new Date().getFullYear()} • Магазин комп&apos;ютерних комплектуючих
      </footer>
    </div>
  );
}

export default App;

