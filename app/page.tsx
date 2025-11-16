'use client';

import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';

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

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  if (!products || products.length === 0) {
    return <div>Aucun produit trouvé.</div>;
  }

  return (
    <div>
      <h1>Liste des Produits</h1>
      <ul>
        {products.map((product: CartItem) => (
          <li key={product.productId}>
            <h2>{product.name}</h2>
            <p>Prix : {product.priceTaxExcluded.toFixed(2)} €</p>
            <p>Référence : {product.productId}</p>
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Ajouter au panier
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
