import { useCart } from './context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map(item => (
          <div key={item.id}>
            <strong>{item.name}</strong> — ${item.price}
            <input
              type="number"
              min="1"
              max={item.stock}
              value={item.quantity}
              onChange={e => updateQuantity(item.id, parseInt(e.target.value), item.stock)}
            />
            <button onClick={() => removeFromCart(item.id)}>🗑️</button>
          </div>
        ))
      )}
    </div>
  );
};

export default CartPage;
