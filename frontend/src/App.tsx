import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProductListPage from "./pages/ProductListPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header />

      {/* Products Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProductListPage />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
