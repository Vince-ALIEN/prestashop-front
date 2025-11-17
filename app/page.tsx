'use client';

import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { ShoppingCart, Package, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface CartItem {
  productId: number;
  name: string;
  quantity: number;
  priceTaxExcluded: number;
  priceTaxIncluded: number;
  category?: string;
}

export default function Home() {
  const { data: products, isLoading, error } = useProducts();
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const handleAddToCart = (product: CartItem) => {
    addToCart(product);
    setAddedToCart(product.productId);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  // État de chargement
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Erreur de chargement</h2>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  // Aucun produit
  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun produit disponible</h2>
          <p className="text-gray-600">Revenez plus tard pour découvrir nos nouveautés.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Découvrez nos produits</h1>
          <p className="text-xl text-blue-100">Les meilleurs produits au meilleur prix</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{products.length}</span> produit{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: CartItem) => (
            <div
              key={product.productId}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Package className="h-20 w-20 text-gray-400" />
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                  {product.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                      {product.category}
                    </span>
                  )}
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-3">
                    Réf: {product.productId}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-blue-600">
                        {product.priceTaxIncluded.toFixed(2)} €
                      </span>
                      <span className="text-sm text-gray-500">TTC</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {product.priceTaxExcluded.toFixed(2)} € HT
                    </p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addedToCart === product.productId}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    addedToCart === product.productId
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addedToCart === product.productId ? 'Ajouté !' : 'Ajouter au panier'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}