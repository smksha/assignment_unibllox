import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="text-xl font-bold text-gray-800">Uniblox Store</div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <div className="relative cursor-pointer">
            <ShoppingCart className="w-6 h-6 text-gray-700" />

            {/* Cart count badge */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
