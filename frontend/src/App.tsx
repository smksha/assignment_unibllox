import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProductListPage from "./pages/ProductListPage";
import { Route, Routes } from "react-router-dom";
import CartPage from "./pages/CartPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
