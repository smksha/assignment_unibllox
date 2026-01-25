import { useCart } from "../../context/CartContext";

type Props = {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity?: number;
  thumbnail: string;
};

export default function ProductCard({
  id,
  title,
  description,
  price,
  quantity,
  thumbnail,
}: Props) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const product = {
      id,
      title,
      description,
      price,
      thumbnail,
      quantity: 1,
    };

    console.log("Product added to cart:", product);

    addToCart(product);
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
        onClick={() => handleAddToCart()}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
      >
        Add to cart
      </button>
    </div>
  );
}
