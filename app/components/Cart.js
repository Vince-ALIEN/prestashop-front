'use client';

import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);

  return (
    <div className="fixed bottom-0 right-0 m-4 bg-white rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Panier</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide.</p>
      ) : (
        <>
          <ul className="mb-4">
            {cart.map((item) => (
              <li key={item.productId} className="mb-3 pb-3 border-b last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.quantity} x {item.priceTaxIncluded.toFixed(2)} €</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p className="text-right font-medium mt-1">
                  { (item.priceTaxIncluded * item.quantity).toFixed(2) } €
                </p>
              </li>
            ))}
          </ul>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Total:</span>
              <span className="font-bold">{getCartTotal().toFixed(2)} €</span>
            </div>
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Commander
            </button>
          </div>
        </>
      )}
    </div>
  );
}
