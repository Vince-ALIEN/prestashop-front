'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

interface CartItem {
  productId: number;
  name: string;
  quantity: number;
  priceTaxIncluded: number;
  category?: string;
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Votre panier est vide.</p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Continuer vos achats
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Liste des produits */}
          <div className="flex-1">
            <ul className="divide-y divide-gray-200">
              {cart.map((item: CartItem) => (
                <li key={item.productId} className="py-6 flex">
                  <div className="shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src="https://via.placeholder.com/150"
                      alt={item.name}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>

                  <div className="ml-6 flex-1 flex flex-col">
                    <div className="flex">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        {item.category && (
                          <p className="mt-1 text-sm text-gray-500">
                            {item.category}
                          </p>
                        )}
                      </div>

                      <div className="ml-6 flex items-center">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>

                        <span className="mx-3 text-gray-700">{item.quantity}</span>

                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                          </svg>
                        </button>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex-1 flex items-end justify-between">
                      <p className="text-sm text-gray-500">Prix unitaire: {item.priceTaxIncluded.toFixed(2)} €</p>
                      <p className="text-lg font-medium text-gray-900">
                        Total: {(item.priceTaxIncluded * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Résumé de commande */}
          <div className="lg:w-80">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>

              <div className="flex justify-between mb-2">
                <span>Sous-total</span>
                <span>{getCartTotal().toFixed(2)} €</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Livraison</span>
                <span>Gratuit</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">{getCartTotal().toFixed(2)} €</span>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors">
                  Passer la commande
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
