// src/pages/ProductListPage.tsx
import ProductCard from "../components/products/ProductCard";
import { useFetch } from "../hooks/use-fetch";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};

type ProductsResponse = {
  products: Product[];
};

export default function ProductListPage() {
  const { data, loading, error } = useFetch<ProductsResponse>(
    "https://dummyjson.com/products",
  );

  if (loading) {
    return <p className="p-4">Loading products...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  return (
    <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {data?.products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          description={product.description}
          price={product.price}
          thumbnail={product.thumbnail}
        />
      ))}
    </main>
  );
}
