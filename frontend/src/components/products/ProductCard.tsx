import { useState } from "react";
import { useCart } from "../../context/CartContext";

type Props = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};

export default function ProductCard({
  id,
  title,
  description,
  price,
  thumbnail,
}: Props) {
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setAdding(true);

    addToCart({
      id,
      title,
      price,
      quantity: 1,
      thumbnail,
    });

    setTimeout(() => {
      setAdding(false);
    }, 300); // small UX delay
  };

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      <img
        src={thumbnail}
        alt={title}
        className="align-center w-40 h-40 object-cover rounded mb-2"
      />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 flex-grow">{description}</p>
      <p className="mt-2 font-bold text-black">₹{price}</p>
      <button
        onClick={handleAddToCart}
        disabled={adding}
        className={`mt-2 px-3 py-1 rounded text-white ${
          adding ? "bg-gray-400" : "bg-blue-600"
        }`}
      >
        {adding ? "Adding..." : "Add to cart"}
      </button>
    </div>
  );
}
