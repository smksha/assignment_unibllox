import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, addToCart, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return <p className="p-4">Your cart is empty.</p>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Your Cart</h2>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-white p-3 rounded shadow"
        >
          <div>
            <p className="font-medium">Product ID: {item.id}</p>
            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => removeFromCart(item.id)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              −
            </button>
            <button
              onClick={() => addToCart({ ...item, quantity: 1 })}
              className="px-2 py-1 bg-blue-600 text-white rounded"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
