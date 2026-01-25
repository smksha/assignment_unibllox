// src/components/product/ProductCard.tsx
type Props = {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};

export default function ProductCard({
  title,
  description,
  price,
  thumbnail,
}: Props) {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      <img
        src={thumbnail}
        alt={title}
        className="h-40 object-cover rounded mb-2"
      />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 flex-grow">{description}</p>
      <div className="mt-2 font-bold">₹{price}</div>
      <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
        Add to cart
      </button>
    </div>
  );
}
