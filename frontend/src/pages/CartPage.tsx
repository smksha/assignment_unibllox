import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { fetchAvailableDiscount, fetchOrderInfo } from "../api/admin";
import { checkout } from "../api/checkout";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [discountCode, setDiscountCode] = useState<string | undefined>(
    undefined,
  );
  const [discountApplied, setDiscountApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);

  const { cartItems, addToCart, removeFromCart, getTotalPrice } = useCart();

  const navigate = useNavigate();
  const DISCOUNT_PERCENT = Number(import.meta.env.VITE_DISCOUNT_PERCENT);

  //fetch order number

  useEffect(() => {
    fetchOrderInfo().then((res) => {
      setOrderNumber(res.nextOrderNumber);
    });
  }, []);

  // Fetch available discount from admin API
  useEffect(() => {
    fetchAvailableDiscount().then((res) => {
      if ("code" in res) {
        setDiscountCode(res.code);
      } else {
        setDiscountMessage(res.message);
      }
    });
  }, []);

  if (cartItems.length === 0) {
    return <p className="p-4">Your cart is empty.</p>;
  }

  //Calculate price after discount
  const totalPrice = getTotalPrice();
  const discountAmount = discountApplied
    ? (totalPrice * DISCOUNT_PERCENT) / 100
    : 0;
  // 10% discount
  const finalPrice = totalPrice - discountAmount;

  //handle checkout
  const handleCheckout = async () => {
    setLoading(true);
    try {
      await checkout(discountApplied ? discountCode! : undefined);
      alert("Checkout successful!");
      navigate("/");
    } catch (error) {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-blue-600 underline"
      >
        ← Back to products
      </button>
      <h2 className="text-xl font-bold">Your Cart</h2>
      {orderNumber && (
        <p className="text-sm text-gray-600">
          This is your{" "}
          <strong>{orderNumber === 1 ? "1st" : `${orderNumber}th`}</strong>{" "}
          order
        </p>
      )}
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
      {/**Discount Code Section */}
      {discountMessage && !discountCode && (
        <p className="text-sm text-gray-500">{discountMessage}</p>
      )}
      {discountCode && !discountApplied && (
        <div className="p-3 bg-green-50 border rounded">
          <p>
            Discount Code ({DISCOUNT_PERCENT}%): <strong>{discountCode}</strong>
          </p>
          <button
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
            onClick={() => setDiscountApplied(true)}
          >
            Apply Discount
          </button>
        </div>
      )}
      {/**Price Calculation */}
      <div className="space-y-1">
        <p>Subtotal: ₹{totalPrice.toFixed(2)}</p>
        {discountApplied && (
          <p className="text-green-700">
            Discount Applied : −₹{discountAmount.toFixed(2)}
          </p>
        )}
        <p className="font-bold text-lg">
          Total Payable: ₹{finalPrice.toFixed(2)}
        </p>
      </div>

      {/**Checkout Button */}
      <button
        disabled={cartItems.length === 0 || loading}
        className="w-full py-2 bg-blue-600 text-white rounded"
        onClick={handleCheckout}
      >
        Checkout
      </button>
    </div>
  );
}
