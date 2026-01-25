import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, addToCart, removeFromCart, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return <p className="p-4">Your cart is empty.</p>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Your Cart</h2>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 bg-white p-3 rounded shadow"
        >
          <p>{item.title}</p>

          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-16 h-16 object-cover rounded"
          />
          <p>
            ₹{item.price} × {item.quantity}
          </p>

          <button onClick={() => removeFromCart(item.id)}>-</button>
          <button onClick={() => addToCart({ ...item, quantity: 1 })}>+</button>
        </div>
      ))}

      <p>Total: ₹{getTotalPrice().toFixed(2)}</p>
    </div>
  );
}
